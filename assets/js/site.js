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
})();
