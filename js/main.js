// E-Glass toggle (called from HTML onclick attributes)
function setEG(state) {
  var g = document.getElementById('egGlass');
  var l = document.getElementById('egLbl');
  var btns = document.querySelectorAll('.glass__toggle button');
  btns.forEach(function (b) { b.classList.toggle('active', b.dataset.state === state); });
  if (state === 'opaque') {
    g.classList.add('opaque');
    l.textContent = 'Frosted (private)';
  } else {
    g.classList.remove('opaque');
    l.textContent = 'Transparent';
  }
}

(function () {
  // Mobile nav toggle
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Wire reasons list → pre-select form reason dropdown
  var reasonSelect = document.getElementById('reason');
  document.querySelectorAll('.form__reasons li').forEach(function (li) {
    li.addEventListener('click', function () {
      var text = li.textContent.trim();
      if (reasonSelect) {
        for (var i = 0; i < reasonSelect.options.length; i++) {
          if (reasonSelect.options[i].text === text) {
            reasonSelect.selectedIndex = i;
            break;
          }
        }
        // Smooth scroll to form
        var formBox = document.querySelector('.form__box');
        if (formBox) formBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Skip animations if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Auto-tag elements with reveal classes
  var revealSel = '.sec__head, .feat__hero, .feat__demo, .feat__card, .aud__row, .proc__phase, .proc__i, .ba__c, .res__i, .cta__inner > *, .form__col, .form__box, .stats__i, .ticker, .testi__card';
  document.querySelectorAll(revealSel).forEach(function (el) {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-l') && !el.classList.contains('reveal-r') && !el.classList.contains('reveal-scale')) {
      el.classList.add('reveal');
    }
  });

  // Stagger groups
  document.querySelectorAll('.feat__grid, .res, .stats__grid, .form__reasons, .ticker__track, .testi__grid').forEach(function (g) {
    g.classList.add('stagger');
  });

  // Alternating directional reveal for audience rows
  document.querySelectorAll('.aud__row').forEach(function (r, i) {
    r.classList.remove('reveal');
    r.classList.add(i % 2 === 0 ? 'reveal-l' : 'reveal-r');
  });

  // Before/after directional reveal
  var ba = document.querySelectorAll('.ba__c');
  if (ba[0]) { ba[0].classList.remove('reveal'); ba[0].classList.add('reveal-l'); }
  if (ba[1]) { ba[1].classList.remove('reveal'); ba[1].classList.add('reveal-r'); }

  // IntersectionObserver for reveal animations
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-scale, .stagger').forEach(function (el) {
    io.observe(el);
  });

  // Count-up animation for stats
  document.querySelectorAll('.stats__big').forEach(function (el) {
    var numEl = el.querySelector('.count');
    if (!numEl) return;
    var target = parseInt(numEl.dataset.target, 10);
    if (isNaN(target)) return;
    var started = false;
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !started) {
          started = true;
          var dur = 1400;
          var t0 = performance.now();
          function step(now) {
            var p = Math.min((now - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            numEl.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(step);
            else numEl.textContent = target;
          }
          requestAnimationFrame(step);
          co.unobserve(el);
        }
      });
    }, { threshold: .5 });
    co.observe(el);
  });

  // Magnetic button micro-interaction
  document.querySelectorAll('.btn-green').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) / r.width;
      var y = (e.clientY - r.top - r.height / 2) / r.height;
      b.style.transform = 'translate(' + (x * 4) + 'px,' + (y * 4 - 2) + 'px)';
    });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });
})();
