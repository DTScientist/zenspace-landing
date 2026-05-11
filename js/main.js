/* ============================================================
   ZenSpace — main.js
   Stripe-inspired patterns, vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. SCROLL REVEAL (IntersectionObserver) ────────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── 2. STICKY NAV — SCROLL-AWARE STATE ────────────────── */
  var nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 76);
    }, { passive: true });
  }

  /* ── 3. MOBILE HAMBURGER MENU ───────────────────────────── */
  var burger   = document.getElementById('navBurger');
  var navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('nav__links--open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('nav__links--open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('nav__links--open')) {
        navLinks.classList.remove('nav__links--open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ── 4. ACTIVE NAV LINK HIGHLIGHT ──────────────────────── */
  var sections   = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  if (sections.length && navAnchors.length) {
    var activeSectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle('nav__link--active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });

    sections.forEach(function (s) { activeSectionObserver.observe(s); });
  }

  /* ── 5. E-GLASS DEMO TOGGLE ─────────────────────────────── */
  window.setEG = function (state) {
    var glass = document.getElementById('egGlass');
    var lbl   = document.getElementById('egLbl');
    var btns  = document.querySelectorAll('.glass__toggle button');

    if (!glass) return;

    if (state === 'opaque') {
      glass.classList.add('opaque');
      if (lbl) lbl.textContent = 'Frosted';
    } else {
      glass.classList.remove('opaque');
      if (lbl) lbl.textContent = 'Transparent';
    }

    btns.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.state === state);
    });
  };

  /* ── 6. FORM VALIDATION (checkbox-aware) ────────────────── */
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var required = form.querySelectorAll('[required]');
      var valid = true;

      required.forEach(function (field) {
        var empty = !field.value.trim();
        field.classList.toggle('input--error', empty);
        if (empty) valid = false;
      });

      if (!valid) {
        var firstError = form.querySelector('.input--error');
        if (firstError) firstError.focus();
        return;
      }

      var btn = form.querySelector('button[type=submit]');
      btn.textContent = 'Sent — we\'ll be in touch';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    });

    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.value.trim()) field.classList.remove('input--error');
      });
    });
  }

  /* ── 7. SMOOTH SCROLL for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 76 + 16; // nav height + breathing room
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
