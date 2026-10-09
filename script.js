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
  var ICONS = {
    linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
    instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>',
    email: '<path d="M2 5h20a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zm1.6 2L12 12.6 20.4 7H3.6zM3 8.8V17h18V8.8l-9 6-9-6z"/>'
  };
  [["LinkedIn", s.linkedin, "linkedin"], ["Instagram", s.instagram, "instagram"], ["Email us", s.email ? "mailto:" + s.email : "", "email"]]
    .forEach(function (x) {
      if (!x[1]) return;
      var a = el("a", "btn btn-ghost btn-social");
      a.href = x[1];
      if (x[1].indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
      a.insertAdjacentHTML("beforeend",
        '<svg class="icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">' + ICONS[x[2]] + "</svg>");
      a.appendChild(el("span", null, x[0]));
      links.appendChild(a);
    });

  document.getElementById("year").textContent = "\u00A9 " + now.getFullYear() + " Indra";

  /* ---------- Contact form (emailed through FormSubmit) ---------- */
  var cf = document.getElementById("contactForm");
  var toEmail = (C.contact && C.contact.email) || "";
  if (cf && toEmail) {
    var cStatus = document.getElementById("cStatus"), cSend = document.getElementById("cSend");
    cf.addEventListener("submit", function (ev) {
      ev.preventDefault();
      cStatus.className = "status";
      if (!cf.checkValidity()) {
        cStatus.textContent = "Please fill in your name, a valid email and a message.";
        cStatus.className = "status err";
        cf.reportValidity();
        return;
      }
      var fd = new FormData(cf);
      if (fd.get("_honey")) return; // bot
      var payload = {
        name: fd.get("name"), email: fd.get("email"), message: fd.get("message"),
        _subject: "Indra website: message from " + fd.get("name"),
        _template: "table", _captcha: "false"
      };
      cSend.disabled = true; cStatus.textContent = "Sending...";
      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(toEmail), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d && (d.success === true || d.success === "true")) {
          cf.reset();
          cStatus.textContent = "Message sent. We will reply to your email soon.";
          cStatus.className = "status ok";
        } else { throw new Error("failed"); }
      }).catch(function () {
        cStatus.className = "status err";
        cStatus.textContent = "Could not send the message. Please email us directly at " + toEmail + ".";
      }).then(function () { cSend.disabled = false; });
    });
  }

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
