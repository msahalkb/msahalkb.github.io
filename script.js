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

  /* ---------- Extra sections from config.sections ---------- */
  var navEl = document.querySelector(".nav nav");
  var navContact = navEl && navEl.querySelector('a[href="#contact"]');
  var lastAfter = {};
  (C.sections || []).forEach(function (sec) {
    if (!sec || !sec.title) return;
    var id = String(sec.id || sec.title).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "section";
    if (document.getElementById(id)) id = id + "-x";
    var anchorId = ["about", "events", "gallery"].indexOf(sec.after) > -1 ? sec.after : "gallery";
    var anchor = lastAfter[anchorId] || document.getElementById(anchorId);
    if (!anchor) return;

    var section = el("section", "section" + (sec.theme === "light" ? " section-light" : ""));
    section.id = id;
    var wrap = el("div", "wrap");
    wrap.appendChild(el("h2", null, sec.title));
    if (sec.intro) wrap.appendChild(el("p", "lead", sec.intro));
    var cards = el("div", "cards");
    (sec.items || []).forEach(function (it) {
      if (!it || !it.title) return;
      var card = el("article", "card");
      if (it.image) {
        var img = new Image();
        img.loading = "lazy"; img.alt = it.alt || it.title; img.src = it.image;
        img.className = "card-img";
        img.onerror = function () { img.remove(); };
        card.appendChild(img);
      }
      var body = el("div", "card-body");
      if (it.tag) body.appendChild(el("span", "tag", it.tag));
      body.appendChild(el("h3", null, it.title));
      if (it.text) body.appendChild(el("p", null, it.text));
      if (it.linkUrl && safeUrl(it.linkUrl)) {
        var a = el("a", "card-link", it.linkText || "Learn more");
        a.href = it.linkUrl; a.target = "_blank"; a.rel = "noopener";
        body.appendChild(a);
      }
      card.appendChild(body);
      cards.appendChild(card);
    });
    wrap.appendChild(cards);
    section.appendChild(wrap);
    anchor.parentNode.insertBefore(section, anchor.nextSibling);
    lastAfter[anchorId] = section;

    if (navEl) {
      var link = el("a", null, sec.title);
      link.href = "#" + id;
      navEl.insertBefore(link, navContact || document.getElementById("navJoin"));
    }
  });

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

  /* ---------- Hero: LiDAR scan that reveals the wordmark ---------- */
  (function () {
    var cv = document.getElementById("scan");
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var stage = cv.parentNode;
    var rdA = document.getElementById("rdAngle"), rdP = document.getElementById("rdPts");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var PI = Math.PI, TAU = PI * 2;
    var W = 0, H = 0, pts = [], ox = 0, oy = 0, tox = 0, toy = 0, visible = true;
    var prevB = null, lastRead = 0, lastT = 0;

    function addArc(cx, cy, r, step) {
      var n = Math.max(8, Math.round(TAU * r / step));
      for (var i = 0; i < n; i++) pts.push({ x: cx + Math.cos(i / n * TAU) * r, y: cy + Math.sin(i / n * TAU) * r, l: 0, a: 0 });
    }
    function addLine(x1, y1, x2, y2, step) {
      var len = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.round(len / step));
      for (var i = 0; i <= n; i++) pts.push({ x: x1 + (x2 - x1) * i / n, y: y1 + (y2 - y1) * i / n, l: 0, a: 0 });
    }

    function build() {
      var r = stage.getBoundingClientRect();
      W = Math.round(r.width); H = Math.round(r.height);
      if (!W || !H) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];

      var off = document.createElement("canvas");
      off.width = W; off.height = H;
      var o = off.getContext("2d");
      o.fillStyle = "#000"; o.textAlign = "center"; o.textBaseline = "middle";
      var fs = W * 0.3;
      function setFont() { o.font = "900 " + fs + "px Archivo, 'Arial Black', Arial, sans-serif"; }
      setFont();
      while (o.measureText("INDRA").width > W * 0.82 && fs > 12) { fs -= 2; setFont(); }
      o.fillText("INDRA", W / 2, H * 0.36);
      var data = o.getImageData(0, 0, W, H).data;
      var step = Math.max(4, Math.round(W / 105));
      for (var y = 0; y < H; y += step)
        for (var x = 0; x < W; x += step)
          if (data[(y * W + x) * 4 + 3] > 128) pts.push({ x: x, y: y, l: 0, a: 0 });

      // the "room" around the robot: walls and two obstacles
      var m = Math.round(W * 0.03), s2 = step * 1.6;
      addLine(m, m, W - m, m, s2); addLine(m, m, m, H - m, s2); addLine(W - m, m, W - m, H - m, s2);
      addLine(m, H - m, W - m, H - m, s2);
      addArc(W * 0.19, H * 0.68, W * 0.06, s2);
      addArc(W * 0.83, H * 0.7, W * 0.045, s2);

      ox = tox = W / 2; oy = toy = H * 0.9;
      prevB = null;
    }

    function angles() {
      for (var i = 0; i < pts.length; i++) {
        var a = Math.atan2(pts[i].y - oy, pts[i].x - ox);
        pts[i].a = a < 0 ? a + TAU : a;
      }
    }

    function draw(B, sign) {
      ctx.clearRect(0, 0, W, H);
      var R = Math.hypot(W, H);
      if (B !== null) {
        ctx.fillStyle = "rgba(255,210,31,0.09)";
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + Math.cos(B) * R, oy + Math.sin(B) * R);
        ctx.lineTo(ox + Math.cos(B - sign * 0.26) * R, oy + Math.sin(B - sign * 0.26) * R);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,210,31,0.75)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + Math.cos(B) * R, oy + Math.sin(B) * R); ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      var i, p, lit = 0;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        if (p.l <= 0.02) ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        if (p.l > 0.02) {
          lit++;
          ctx.fillStyle = "rgba(255,210,31," + (0.25 + p.l * 0.75).toFixed(2) + ")";
          var sz = 2 + p.l * 1.6;
          ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
        }
      }
      // the sensor
      ctx.fillStyle = "#000"; ctx.strokeStyle = "#FFD21F"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(ox, oy, 7, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#FFD21F"; ctx.beginPath(); ctx.arc(ox, oy, 2.2, 0, TAU); ctx.fill();
      return lit;
    }

    function tick(t) {
      requestAnimationFrame(tick);
      if (!visible || !W) return;
      var dt = Math.min(t - lastT, 64); lastT = t;
      ox += (tox - ox) * 0.08; oy += (toy - oy) * 0.08;
      angles();
      var B = 1.5 * PI + Math.sin(t * 0.0008) * 0.53 * PI;
      var from = prevB === null ? B : prevB;
      var sign = B >= from ? 1 : -1;
      var lo = Math.min(from, B) - 0.006, hi = Math.max(from, B) + 0.006;
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        if (p.a >= lo && p.a <= hi) p.l = 1;
        else if (p.l > 0) p.l = Math.max(0, p.l - dt / 4800);
      }
      prevB = B;
      var lit = draw(B, sign);
      if (t - lastRead > 120) {
        lastRead = t;
        var deg = Math.round((B - 1.5 * PI) * 180 / PI);
        var ds = String(Math.abs(deg)); while (ds.length < 3) ds = "0" + ds;
        rdA.textContent = "bearing " + (deg < 0 ? "-" : "+") + ds;
        rdP.textContent = lit + " returns";
      }
    }

    function start() {
      build();
      if (!W) return;
      if (reduce) {
        angles();
        pts.forEach(function (p) { p.l = 0.85; });
        draw(null, 1);
        rdA.textContent = "scan complete"; rdP.textContent = pts.length + " returns";
      }
    }

    start();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
    if ("ResizeObserver" in window) {
      var rt;
      new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(start, 120); }).observe(stage);
    }
    if (reduce) return;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(stage);
    }
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      tox = Math.min(Math.max(e.clientX - r.left, W * 0.1), W * 0.9);
      toy = Math.min(Math.max(e.clientY - r.top, H * 0.62), H * 0.95);
    });
    stage.addEventListener("pointerleave", function () { tox = W / 2; toy = H * 0.9; });
    requestAnimationFrame(tick);
  })();
})();
