// Theme switch, typing line in the hero, and the contact form.
(function () {
  var root = document.documentElement;

  // Light / dark theme
  var toggle = document.getElementById("theme-toggle");
  function label() {
    if (!toggle) return;
    var dark = root.getAttribute("data-theme") === "dark";
    toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  label();
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
  }

  // Notebook cell: types the code once, then shows the output
  var code = document.getElementById("nb-code");
  var out = document.getElementById("nb-out");
  var caret = document.querySelector(".nb-in .caret");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (code && out && !reduce) {
    var full = code.getAttribute("data-code") || code.textContent;
    var n = 0;
    code.textContent = "";
    out.classList.add("waiting");
    setTimeout(function type() {
      n++;
      code.textContent = full.slice(0, n);
      if (n < full.length) { setTimeout(type, 70); }
      else {
        setTimeout(function () {
          out.classList.remove("waiting");
          if (caret) caret.classList.add("done");
        }, 350);
      }
    }, 500);
  }

  // Email button: small panel with copy, Gmail and mail-app options
  var eb = document.getElementById("email-btn");
  var pop = document.getElementById("email-pop");
  var status = document.getElementById("email-status");
  function closePop() { if (pop && !pop.hidden) { pop.hidden = true; eb.setAttribute("aria-expanded", "false"); } }
  if (eb && pop) {
    eb.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = pop.hidden;
      pop.hidden = !open;
      eb.setAttribute("aria-expanded", open ? "true" : "false");
      if (status) status.textContent = "";
    });
    pop.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", closePop);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closePop(); eb.focus(); } });
    var copy = document.getElementById("email-copy");
    if (copy) copy.addEventListener("click", function () {
      var addr = copy.getAttribute("data-email");
      function done(ok) { if (status) status.textContent = ok ? "Copied to clipboard." : "Select the address above to copy it."; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
  }
})();
