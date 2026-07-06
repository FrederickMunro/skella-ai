let currentLanguage = "en";

const contactMessages = {
  en: {
    contactFormSuccess: "Thank you! Your message has been sent.",
    contactFormError: "Something went wrong. Please try again.",
    contactSending: "Sending...",
    contactSubmit: "Send",
  },
  fr: {
    contactFormSuccess: "Merci! Votre message a été envoyé.",
    contactFormError: "Une erreur s'est produite. Veuillez réessayer.",
    contactSending: "Envoi en cours...",
    contactSubmit: "Envoyer",
  },
};

function getPageLanguage() {
  const path = window.location.pathname;
  if (/\/fr(\/|$)/.test(path)) return "fr";
  if (/\/en(\/|$)/.test(path)) return "en";
  const stored = localStorage.getItem("skella_language");
  if (stored === "fr" || stored === "en") return stored;
  return document.documentElement.lang?.startsWith("fr") ? "fr" : "en";
}

function getContactCopy(lang = getPageLanguage()) {
  return {
    ...contactMessages.en,
    ...contactMessages[lang],
    ...(window.translations?.[lang] || {}),
  };
}

function applyLanguage(language) {

  document.documentElement.lang = language;
  localStorage.setItem("skella_language", language);

  const t = getContactCopy(language);

  const contactStatus = document.getElementById("contact-form-status");
  if (contactStatus && !contactStatus.hidden) {
    if (contactStatus.classList.contains("is-success")) {
      contactStatus.textContent = t.contactFormSuccess || "";
    } else if (contactStatus.classList.contains("is-error")) {
      contactStatus.textContent = t.contactFormError || "";
    }
  }

  const contactSubmit = document.querySelector("#contact-form button[type='submit']");
  if (contactSubmit && !contactSubmit.disabled) {
    contactSubmit.textContent = t.contactSubmit || contactSubmit.textContent;
  }
}

function toggleLanguage() {
  currentLanguage = currentLanguage === "en" ? "fr" : "en";
  applyLanguage(currentLanguage);
}

currentLanguage = getPageLanguage();
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

  container.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      isDragging = true;
      updatePosition(e.touches[0].clientY);
    },
    { passive: false }
  );

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  window.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.touches[0].clientY);
    },
    { passive: false }
  );
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

function formatPhoneDigits(digits) {
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function initPhoneInputs() {
  document.querySelectorAll('input[name="phone"]').forEach((input) => {
    if (input.dataset.phoneInit) return;
    input.dataset.phoneInit = "true";

    input.type = "text";
    input.inputMode = "numeric";
    input.maxLength = 14;

    input.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const allowed = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];
      if (allowed.includes(e.key)) return;
      if (/^\d$/.test(e.key)) return;
      e.preventDefault();
    });

    input.addEventListener("beforeinput", (e) => {
      if (!e.data || e.inputType.startsWith("delete")) return;
      if (!/^\d+$/.test(e.data)) e.preventDefault();
    });

    input.addEventListener("input", () => {
      const digitsBeforeCursor = input.value
        .slice(0, input.selectionStart)
        .replace(/\D/g, "").length;
      const digits = input.value.replace(/\D/g, "").slice(0, 10);
      const formatted = formatPhoneDigits(digits);

      input.value = formatted;

      let cursor = 0;
      let digitsSeen = 0;
      while (cursor < formatted.length && digitsSeen < digitsBeforeCursor) {
        if (/\d/.test(formatted[cursor])) digitsSeen++;
        cursor++;
      }
      input.setSelectionRange(cursor, cursor);
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("contact-form-status");
  if (!form || !statusEl) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const copy = getContactCopy();

  function setStatus(type, messageKey) {
    const message = copy[messageKey] || "";
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
    submitBtn.textContent = copy.contactSending || "Sending...";

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
      submitBtn.textContent = copy.contactSubmit || defaultSubmitText;
    }
  });
}

initPhoneInputs();
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

function hasTrackingConsent() {
  return (
    window.__skellaTrackingAllowed === true ||
    getCookie("cookieConsent") === "accepted"
  );
}

function deleteCookie(name) {
  const expired = `${name}=; Max-Age=0; path=/`;
  document.cookie = expired;
  document.cookie = `${expired}; domain=.skella.ca`;
  document.cookie = `${expired}; domain=skella.ca`;
  document.cookie = `${expired}; domain=.skella.ca; Secure; SameSite=Lax`;
}

function clearTrackingCookies() {
  if (typeof window.skellaClearTrackingCookies === "function") {
    window.skellaClearTrackingCookies();
    return;
  }

  const names = new Set();
  document.cookie.split("; ").forEach((entry) => {
    if (!entry) return;
    const name = entry.split("=")[0];
    if (/^(_ga|_gid|_gcl)/.test(name)) names.add(name);
  });
  names.forEach(deleteCookie);
}

function denyTracking() {
  window.__skellaTrackingAllowed = false;
  window.__gaLoaded = false;

  if (typeof window.skellaDenyTracking === "function") {
    window.skellaDenyTracking();
    return;
  }

  clearTrackingCookies();
}

function grantTracking() {
  window.__skellaTrackingAllowed = true;

  if (typeof window.skellaGrantTracking === "function") {
    window.skellaGrantTracking();
  }
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
    grantTracking();
    enableTracking();
    closePanel();
  });

  rejectBtn.addEventListener("click", () => {
    setCookie("cookieConsent", "rejected", 180);
    denyTracking();
    closePanel();
    location.reload();
  });

  // INITIAL STATE
  if (consent === "accepted") {
    grantTracking();
    enableTracking();
    closePanel();
    return;
  }

  if (consent === "rejected") {
    denyTracking();
    closePanel();
    return;
  }

  // FIRST VISIT → show panel
  openPanel();
});

const GOOGLE_ADS_ID = "AW-16871341515";
const GA4_MEASUREMENT_ID = "G-J7FS7C2HP5";

function enableTracking() {
  if (!hasTrackingConsent()) return;
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  script.async = true;

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }

    window.gtag = gtag;
    gtag("js", new Date());

    if (hasTrackingConsent()) {
      grantTracking();
      gtag("config", GA4_MEASUREMENT_ID);
      gtag("config", GOOGLE_ADS_ID);
    }
  };

  document.head.appendChild(script);
}