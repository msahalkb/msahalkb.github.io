(function () {
  "use strict";
  var C = window.INDRA || {};
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function parseDate(s) {
    if (!s) return null;
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function endOfDay(s) {
    var d = parseDate(s);
    return d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59) : null;
  }
  function safeUrl(u) {
    return /^(https?:|mailto:)/i.test(u || "") ? u : "";
  }
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  /* ---------- Announcements ---------- */
  var box = document.getElementById("announcements");
  (C.announcements || []).forEach(function (a) {
    var from = parseDate(a.from), until = endOfDay(a.until);
    if ((from && now < from) || (until && now > until)) return;
    var note = el("div", "note");
    note.appendChild(el("p", null, a.text || ""));
    if (a.linkUrl && safeUrl(a.linkUrl)) {
      var l = el("a", null, a.linkText || "Learn more");
      l.href = a.linkUrl; l.target = "_blank"; l.rel = "noopener";
      note.appendChild(l);
    }
    box.appendChild(note);
  });

  /* ---------- Events ---------- */
  function eventCard(e) {
    var d = parseDate(e.date);
    var card = el("article", "event");
    var tile = el("div", "date-tile");
    if (d) {
      tile.appendChild(el("span", "d", String(d.getDate())));
      tile.appendChild(el("span", "m", MONTHS[d.getMonth()]));
      tile.appendChild(el("span", "y", String(d.getFullYear())));
    }
    var body = el("div");
    body.appendChild(el("h4", null, e.title || "Event"));
    var meta = [e.time, e.venue].filter(Boolean).join(", ");
    if (meta) body.appendChild(el("div", "meta", meta));
    if (e.description) body.appendChild(el("p", null, e.description));
    if (e.linkUrl && safeUrl(e.linkUrl)) {
      var a = el("a", null, e.linkText || "More details");
      a.href = e.linkUrl; a.target = "_blank"; a.rel = "noopener";
      body.appendChild(a);
    }
    card.appendChild(tile); card.appendChild(body);
    return card;
  }
  var events = (C.events || []).filter(function (e) { return parseDate(e.date); });
  var upcoming = events.filter(function (e) { return parseDate(e.date) >= today; })
    .sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
  var past = events.filter(function (e) { return parseDate(e.date) < today; })
    .sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });

  var upEl = document.getElementById("eventsUpcoming");
  var pastEl = document.getElementById("eventsPast");
  pastEl.classList.add("past");
  if (upcoming.length) upcoming.forEach(function (e) { upEl.appendChild(eventCard(e)); });
  else upEl.appendChild(el("p", "empty", "No events are scheduled right now. Follow us on Instagram to hear first."));
  if (past.length) past.forEach(function (e) { pastEl.appendChild(eventCard(e)); });
  else document.getElementById("pastHeading").hidden = true;

  /* ---------- Gallery ---------- */
  var grid = document.getElementById("galleryGrid");
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var lbCap = document.getElementById("lightboxCap");
  var photos = C.gallery || [];
  if (!photos.length) grid.appendChild(el("p", "empty", "Photos coming soon."));
  photos.forEach(function (p) {
    var fig = el("button", "shot");
    fig.type = "button";
    var img = new Image();
    img.loading = "lazy";
    img.alt = p.alt || p.caption || "";
    img.src = p.src;
    img.onerror = function () {
      fig.className = "shot placeholder";
      fig.disabled = true;
      fig.textContent = "Photo coming soon" + (p.caption ? ": " + p.caption : "");
    };
    fig.appendChild(img);
    if (p.caption) fig.appendChild(el("span", "cap", p.caption));
    fig.addEventListener("click", function () {
      lbImg.src = p.src; lbImg.alt = img.alt; lbCap.textContent = p.caption || "";
      if (lb.showModal) lb.showModal();
    });
    grid.appendChild(fig);
  });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });

  /* ---------- Membership ---------- */
  var m = C.membership || {};
  var closes = endOfDay(m.closesOn);
  var memberOpen = m.open === true && (!closes || now <= closes);
  if (memberOpen) {
    document.getElementById("join").hidden = false;
    document.getElementById("navJoin").hidden = false;
    document.getElementById("joinTitle").textContent = m.title || "Join Indra";
    document.getElementById("joinText").textContent = m.text || "";
    if (closes) {
      var d = parseDate(m.closesOn);
      document.getElementById("joinDeadline").textContent =
        "Applications close on " + d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear() + ".";
    }
    var btn = document.getElementById("joinBtn");
    var url = safeUrl(m.formUrl);
    if (url) {
      btn.href = url;
      if (m.embed) {
        btn.hidden = true;
        var frame = document.createElement("iframe");
        frame.src = url; frame.title = "Membership form"; frame.loading = "lazy";
        var holder = document.getElementById("joinEmbed");
        holder.hidden = false; holder.appendChild(frame);
        document.querySelector(".join").classList.add("has-embed");
      }
    } else {
      btn.removeAttribute("href");
      btn.setAttribute("aria-disabled", "true");
      btn.textContent = "Form link coming soon";
    }
  }

  /* ---------- Social links ---------- */
  var s = C.social || {};
  var links = document.getElementById("socialLinks");
  [["LinkedIn", s.linkedin], ["Instagram", s.instagram], ["Email us", s.email ? "mailto:" + s.email : ""]]
    .forEach(function (x) {
      if (!x[1]) return;
      var a = el("a", "btn btn-ghost", x[0]);
      a.href = x[1];
      if (x[1].indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
      links.appendChild(a);
    });

  document.getElementById("year").textContent = "\u00A9 " + now.getFullYear() + " Indra";

  /* ---------- Hero robotic arm (reaches toward the pointer) ---------- */
  var svg = document.getElementById("arm");
  var L1 = 210, L2 = 175, BX = 300, BY = 530;
  var link1 = document.getElementById("link1"), link2 = document.getElementById("link2");
  var claw = document.getElementById("claw"), target = document.getElementById("target");
  var j0 = document.getElementById("j0"), j1 = document.getElementById("j1");
  var tx = 360, ty = 190, cx = tx, cy = ty, lastMove = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pose(x, y) {
    var dx = x - BX, dy = y - BY;
    var d = Math.sqrt(dx * dx + dy * dy);
    var max = L1 + L2 - 2, min = Math.abs(L1 - L2) + 20;
    var k = Math.min(Math.max(d, min), max) / (d || 1);
    var px = BX + dx * k, py = BY + dy * k;
    d = Math.min(Math.max(d, min), max);
    var a = Math.atan2(py - BY, px - BX);
    var ang = Math.acos((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d));
    var sh = a - ang;
    var ex = BX + Math.cos(sh) * L1, ey = BY + Math.sin(sh) * L1;
    var fa = Math.atan2(py - ey, px - ex);
    link1.setAttribute("x1", BX); link1.setAttribute("y1", BY);
    link1.setAttribute("x2", ex); link1.setAttribute("y2", ey);
    link2.setAttribute("x1", ex); link2.setAttribute("y1", ey);
    link2.setAttribute("x2", px); link2.setAttribute("y2", py);
    j0.setAttribute("cx", BX); j0.setAttribute("cy", BY);
    j1.setAttribute("cx", ex); j1.setAttribute("cy", ey);
    claw.setAttribute("transform", "translate(" + px + " " + py + ") rotate(" + (fa * 180 / Math.PI) + ")");
    target.setAttribute("transform", "translate(" + x + " " + y + ")");
  }

  function toSvg(e) {
    var r = svg.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width * 600;
    ty = (e.clientY - r.top) / r.height * 600;
    tx = Math.min(Math.max(tx, 30), 570);
    ty = Math.min(Math.max(ty, 40), 500);
    lastMove = performance.now();
  }

  if (reduce) {
    pose(380, 200);
  } else {
    window.addEventListener("pointermove", toSvg, { passive: true });
    (function tick(t) {
      if (t - lastMove > 2500) {
        tx = 330 + Math.cos(t / 1700) * 130;
        ty = 230 + Math.sin(t / 1300) * 90;
      }
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      pose(cx, cy);
      requestAnimationFrame(tick);
    })(0);
  }
})();
