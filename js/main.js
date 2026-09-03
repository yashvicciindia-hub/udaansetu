/* ==========================================================================
   UdaanSetu — MAIN JS
   Shared across every page. Reads links/config from js/config.js.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Wire every [data-form] element to the right Google Form ----------
     Add data-form="individual" | "partner" | "enquiry" to any <a> or <button>.
     The correct URL comes from UDAANSETU_CONFIG in js/config.js — edit the
     URL there once and it updates everywhere on the site. */
  document.querySelectorAll("[data-form]").forEach((el) => {
    const key = el.getAttribute("data-form");
    const url = UDAANSETU_CONFIG.forms[key];
    if (!url) return;
    if (el.tagName === "A") {
      el.setAttribute("href", url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    } else {
      el.addEventListener("click", () => {
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }
  });

  /* ---------- 2. Contact info from config (footer + contact page) ---------- */
  document.querySelectorAll("[data-contact='address']").forEach(el => el.textContent = UDAANSETU_CONFIG.contact.address);
  document.querySelectorAll("[data-contact='email']").forEach(el => { el.textContent = UDAANSETU_CONFIG.contact.email; if (el.tagName === "A") el.href = "mailto:" + UDAANSETU_CONFIG.contact.email; });
  document.querySelectorAll("[data-contact='phone']").forEach(el => { el.textContent = UDAANSETU_CONFIG.contact.phone; if (el.tagName === "A") el.href = "tel:" + UDAANSETU_CONFIG.contact.phone.split(" / ")[0].replace(/\s/g, ""); });

  /* ---------- 3. Mobile menu ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (navToggle && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    mobileMenu.setAttribute("aria-hidden", "true");
    navToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  /* ---------- 4. Active nav link ---------- */
  const current = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href.endsWith(current) && current !== "") a.classList.add("active");
  });

  /* ---------- 5. Get Started modal ---------- */
  const modalOverlay = document.querySelector(".modal-overlay");
  const openTriggers = document.querySelectorAll("[data-open-modal]");
  const closeTriggers = document.querySelectorAll("[data-close-modal]");
  if (modalOverlay) {
    openTriggers.forEach(t => t.addEventListener("click", (e) => {
      e.preventDefault();
      modalOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }));
    closeTriggers.forEach(t => t.addEventListener("click", () => {
      modalOverlay.classList.remove("open");
      document.body.style.overflow = "";
    }));
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modalOverlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---------- 6. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in-view"));
  }

  /* ---------- 7. Count-up numbers (elements with data-count-to) ---------- */
  const counters = document.querySelectorAll("[data-count-to]");
  if ("IntersectionObserver" in window && counters.length) {
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-count-to"));
        const suffix = el.getAttribute("data-count-suffix") || "";
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countIo.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(el => countIo.observe(el));
  }

  /* ---------- 8. Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

});
