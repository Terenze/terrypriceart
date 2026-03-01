// Footer year
document.getElementById('year')?.append(String(new Date().getFullYear()));

// Stripe Payment Link helper
// Put your Stripe payment link into data-stripe-link on the Buy button
const buyBtn = document.getElementById('buyPrintBtn');
if (buyBtn) {
  const stripeLink = buyBtn.getAttribute('data-stripe-link');
  if (stripeLink && stripeLink.startsWith('https://')) {
    buyBtn.setAttribute('href', stripeLink);
  }
}

// GA4 click tracking helper (works once GA4 config is enabled)
function track(name, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-analytics]');
  if (!el) return;

  const eventName = el.getAttribute('data-analytics');
  const artwork = el.getAttribute('data-artwork') || undefined;

  track(eventName, {
    artwork_name: artwork,
    link_url: el.getAttribute('href') || undefined,
  });
});

// --- Cookie consent (top banner + inline settings) ---
const CONSENT_KEY = "tp_cookie_consent_v1";

function getConsent() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); }
  catch { return null; }
}

function setConsent(consent) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

// Add your trackers here later.
// Example: loadGA4("G-XXXX") ONLY after analytics consent.
function applyConsent(consent) {
  // Future: if (consent?.analytics) loadGA4("G-XXXXXXXXXX");
}

(function initCookieUI(){
  const banner = document.getElementById("cookie-banner");
  const settings = document.getElementById("cookie-settings");

  const acceptBtn = document.getElementById("cookie-accept-btn");
  const rejectBtn = document.getElementById("cookie-reject-btn");
  const settingsBtn = document.getElementById("cookie-settings-btn");
  const saveBtn = document.getElementById("cookie-save-btn");
  const cancelBtn = document.getElementById("cookie-cancel-btn");

  const analyticsToggle = document.getElementById("cookie-analytics");
  const marketingToggle = document.getElementById("cookie-marketing");

  if (!banner || !settings || !acceptBtn || !rejectBtn || !settingsBtn || !saveBtn || !cancelBtn || !analyticsToggle || !marketingToggle) {
    // If any elements are missing on a page, fail safely (no banner)
    return;
  }

  const existing = getConsent();
  if (existing) {
    applyConsent(existing);
    // keep banner hidden if consent already recorded
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
    if (expanded) closeSettings();
    else openSettings();
  });

  acceptBtn.addEventListener("click", () => {
    const consent = { necessary: true, analytics: true, marketing: false };
    setConsent(consent);
    closeBanner();
    applyConsent(consent);
  });

  rejectBtn.addEventListener("click", () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    setConsent(consent);
    closeBanner();
    applyConsent(consent);
  });

  saveBtn.addEventListener("click", () => {
    const consent = {
      necessary: true,
      analytics: !!analyticsToggle.checked,
      marketing: !!marketingToggle.checked
    };
    setConsent(consent);
    closeBanner();
    applyConsent(consent);
  });

  cancelBtn.addEventListener("click", () => {
    closeSettings();
  });
})();