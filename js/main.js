/* ===============================
   Terry Price Art – Main JS
   =============================== */

/* Set footer year automatically */
(function setYear(){
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

/* ===============================
   Cookie Consent (Top Banner)
   =============================== */

const CONSENT_KEY = "tp_cookie_consent_v1";

function getConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY));
  } catch {
    return null;
  }
}

function setConsent(consent) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

/* Add trackers here later (only after consent) */
function applyConsent(consent) {
  // Example later:
  // if (consent?.analytics) loadGA4("G-XXXXXXXXXX");
}

(function initCookieUI(){

  const banner = document.getElementById("cookie-banner");
  const settings = document.getElementById("cookie-settings");

  const acceptBtn = document.getElementById("cookie-accept-btn");
  const rejectBtn = document.getElementById("cookie-reject-btn");
  const settingsBtn = document.getElementById("cookie-settings-btn");

  // Essential elements required to run
  if (!banner || !settings || !acceptBtn || !rejectBtn || !settingsBtn) {
    return;
  }

  // Optional elements (banner should still work without these)
  const saveBtn = document.getElementById("cookie-save-btn");
  const cancelBtn = document.getElementById("cookie-cancel-btn");
  const analyticsToggle = document.getElementById("cookie-analytics");
  const marketingToggle = document.getElementById("cookie-marketing");

  const existingConsent = getConsent();

  if (existingConsent) {
    applyConsent(existingConsent);
    banner.hidden = true;
    settings.hidden = true;
    settingsBtn.setAttribute("aria-expanded", "false");
    return;
  }

  // Show banner (default: no optional cookies)
  banner.hidden = false;
  settings.hidden = true;
  settingsBtn.setAttribute("aria-expanded", "false");

  function openSettings() {
    settings.hidden = false;
    settingsBtn.setAttribute("aria-expanded", "true");
  }

  function closeSettings() {
    settings.hidden = true;
    settingsBtn.setAttribute("aria-expanded", "false");
  }

  function closeBanner() {
    banner.hidden = true;
    settings.hidden = true;
    settingsBtn.setAttribute("aria-expanded", "false");
  }

  settingsBtn.addEventListener("click", () => {
    const expanded = settingsBtn.getAttribute("aria-expanded") === "true";
    expanded ? closeSettings() : openSettings();
  });

  acceptBtn.addEventListener("click", () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: false
    };
    setConsent(consent);
    closeBanner();
    applyConsent(consent);
  });

  rejectBtn.addEventListener("click", () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    setConsent(consent);
    closeBanner();
    applyConsent(consent);
  });

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const consent = {
        necessary: true,
        analytics: !!analyticsToggle?.checked,
        marketing: !!marketingToggle?.checked
      };
      setConsent(consent);
      closeBanner();
      applyConsent(consent);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      closeSettings();
    });
  }

})();
