(function () {
  function readCookie(name) {
    var match = document.cookie.match(
      new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)")
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  function deleteCookie(name) {
    var expired = name + "=; Max-Age=0; path=/";
    document.cookie = expired;
    document.cookie = expired + "; domain=.skella.ca";
    document.cookie = expired + "; domain=skella.ca";
    document.cookie = expired + "; domain=.skella.ca; Secure; SameSite=Lax";
  }

  function clearTrackingCookies() {
    document.cookie.split("; ").forEach(function (entry) {
      if (!entry) return;
      var name = entry.split("=")[0];
      if (/^(_ga|_gid|_gcl)/.test(name)) deleteCookie(name);
    });
  }

  function removeGoogleTagScripts() {
    document.querySelectorAll('script[src*="googletagmanager.com"]').forEach(function (node) {
      node.remove();
    });
  }

  var consent = readCookie("cookieConsent");
  window.__skellaTrackingAllowed = consent === "accepted";

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  if (consent === "accepted") {
    gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  }

  if (consent === "rejected") {
    removeGoogleTagScripts();
    clearTrackingCookies();
  }

  window.skellaClearTrackingCookies = clearTrackingCookies;
  window.skellaRemoveGoogleTagScripts = removeGoogleTagScripts;

  window.skellaDenyTracking = function () {
    window.__skellaTrackingAllowed = false;
    gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    removeGoogleTagScripts();
    clearTrackingCookies();
  };

  window.skellaGrantTracking = function () {
    window.__skellaTrackingAllowed = true;
    gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  };
})();
