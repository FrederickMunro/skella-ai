let currentLanguage = "en";

function applyLanguage(language) {
  const table = translations[language];
  if (!table) return;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (table[key]) {
      node.textContent = table[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (table[key]) {
      node.placeholder = table[key];
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const key = node.getAttribute("data-i18n-aria");
    if (table[key]) {
      node.setAttribute("aria-label", table[key]);
    }
  });

  document.querySelectorAll("[data-i18n-href]").forEach((node) => {
    const key = node.getAttribute("data-i18n-href");
    if (table[key]) {
      node.setAttribute("href", table[key]);
    }
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    const key = node.getAttribute("data-i18n-alt");
    if (table[key]) {
      node.setAttribute("alt", table[key]);
    }
  });

  document.querySelectorAll("[data-i18n-content]").forEach((node) => {
    const key = node.getAttribute("data-i18n-content");
    if (table[key]) {
      node.setAttribute("content", table[key]);
    }
  });

  document.documentElement.lang = language;
  localStorage.setItem("skella_language", language);

  const contactStatus = document.getElementById("contact-form-status");
  if (contactStatus && !contactStatus.hidden) {
    if (contactStatus.classList.contains("is-success")) {
      contactStatus.textContent = table.contactFormSuccess || "";
    } else if (contactStatus.classList.contains("is-error")) {
      contactStatus.textContent = table.contactFormError || "";
    }
  }

  const contactSubmit = document.querySelector("#contact-form button[type='submit']");
  if (contactSubmit && !contactSubmit.disabled) {
    contactSubmit.textContent = table.contactSubmit || contactSubmit.textContent;
  }
}

function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "fr" : "en";
  applyLanguage(currentLanguage);
}

const storedLanguage = localStorage.getItem("skella_language");
if (storedLanguage && (storedLanguage === "en" || storedLanguage === "fr")) {
  currentLanguage = storedLanguage;
}
applyLanguage(currentLanguage);

document
  .querySelectorAll("#lang-toggle, #lang-toggle-mobile")
  .forEach((btn) => btn.addEventListener("click", toggleLanguage));

document.querySelectorAll(".compare-vertical").forEach((container) => {
  const topImage = container.querySelector(".img-top");
  const handle = container.querySelector(".slider-handle");

  let isDragging = false;

  const updatePosition = (clientY) => {
    const rect = container.getBoundingClientRect();
    let offsetY = clientY - rect.top;

    offsetY = Math.max(0, Math.min(offsetY, rect.height));
    const percent = (offsetY / rect.height) * 100;

    topImage.style.clipPath = `inset(${percent}% 0 0 0)`;
    handle.style.top = `${percent}%`;
  };

  container.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    updatePosition(e.clientY);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    updatePosition(e.clientY);
  });

  container.addEventListener("touchstart", (e) => {
    isDragging = true;
    updatePosition(e.touches[0].clientY);
  });

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientY);
  });
});

const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");

function closeMobileMenu() {
  mobileNav?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

hamburger?.addEventListener("click", (e) => {
  e.stopPropagation();
  mobileNav?.classList.toggle("open");
  document.body.classList.toggle("menu-open");
});

document.addEventListener("click", (e) => {
  if (!mobileNav?.classList.contains("open")) return;
  if (mobileNav.contains(e.target) || hamburger?.contains(e.target)) return;
  closeMobileMenu();
});

/* DROPDOWN CLICK FOR MOBILE */
document.querySelectorAll(".dropdown-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("open");
  });
});

const serviceRows = document.querySelectorAll(".service-row");

const serviceObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        serviceObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

serviceRows.forEach((row) => {
  serviceObserver.observe(row);
}); 

function initLightbox() {
  let lightbox = document.getElementById("lightbox");

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = "lightbox";
    lightbox.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<img class="lightbox-img" src="" alt="">';
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  const openLightbox = (img) => {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    window.addEventListener("beforeunload", () => {
      document.body.style.overflow = "";
    });
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImg.removeAttribute("src");
  };

  document
    .querySelectorAll(".lightbox-trigger, .pool-image, .pool-model")
    .forEach((img) => {
      img.addEventListener("click", () => openLightbox(img));
    });

  closeBtn?.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

initLightbox();

function initBackToTop() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "back-to-top";
  btn.setAttribute("data-i18n-aria", "backToTopAria");
  const label = window.translations?.[window.currentLanguage]?.backToTopAria || "Back to top";
  btn.setAttribute("aria-label", label);
  btn.innerHTML =
    '<svg class="back-to-top-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<polyline points="7 15 12 10 17 15" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";
  document.body.appendChild(btn);

  const showAfter = 400;

  const updateVisibility = () => {
    btn.classList.toggle("is-visible", window.scrollY > showAfter);
  };

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();

  btn.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

initBackToTop();

function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("contact-form-status");
  if (!form || !statusEl) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  function setStatus(type, messageKey) {
    const message = translations[currentLanguage]?.[messageKey] || "";
    statusEl.textContent = message;
    statusEl.hidden = !message;
    statusEl.classList.remove("is-success", "is-error");
    if (type) statusEl.classList.add(type === "success" ? "is-success" : "is-error");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honey = form.querySelector('input[name="_honey"]');
    if (honey?.value) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const defaultSubmitText = submitBtn.textContent;

    submitBtn.disabled = true;
    statusEl.hidden = true;
    statusEl.classList.remove("is-success", "is-error");
    submitBtn.textContent = translations[currentLanguage]?.contactSending || "Sending...";

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) throw new Error("Form submit failed");

      form.reset();
      setStatus("success", "contactFormSuccess");
    } catch {
      setStatus("error", "contactFormError");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = translations[currentLanguage]?.contactSubmit || defaultSubmitText;
    }
  });

  const phoneInput = document.querySelector('input[name="phone"]');

  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // remove all non-numbers

      // limit to 10 digits (standard NA format)
      value = value.slice(0, 10);

      let formatted = value;

      if (value.length > 6) {
        formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length > 3) {
        formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
      }

      e.target.value = formatted;
    });
  }
}

initContactForm();

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let c of cookies) {
    const [key, value] = c.split("=");
    if (key === name) return value;
  }
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  const icon = document.getElementById("cookie-fab");
  const panel = document.getElementById("cookie-panel");
  const acceptBtn = document.getElementById("accept-cookies");
  const rejectBtn = document.getElementById("reject-cookies");

  if (!icon || !panel || !acceptBtn || !rejectBtn) return;

  const consent = getCookie("cookieConsent");

  function openPanel() {
    panel.classList.add("open");
    icon.classList.add("hidden");
  }

  function closePanel() {
    panel.classList.remove("open");
    icon.classList.remove("hidden");
  }

  // CLICK MUST ALWAYS WORK
  icon.addEventListener("click", () => {
    openPanel();
  });

  acceptBtn.addEventListener("click", () => {
    setCookie("cookieConsent", "accepted", 180);
    enableTracking();
    closePanel();
  });

  rejectBtn.addEventListener("click", () => {
    setCookie("cookieConsent", "rejected", 180);
    closePanel();
    location.reload();
  });

  // INITIAL STATE
  if (consent === "accepted") {
    enableTracking();
    closePanel();
    return;
  }

  if (consent === "rejected") {
    closePanel();
    return;
  }

  // FIRST VISIT → show panel
  openPanel();
});

function enableTracking() {
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;

  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=AW-16871341515";
  script.async = true;

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }

    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", "AW-16871341515");
  };

  document.head.appendChild(script);
}