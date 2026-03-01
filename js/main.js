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

// --- Cookie consent (future-proof) ---
const CONSENT_KEY = "tp_cookie_consent_v1";

function getConsent() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); }
  catch { return null; }
}

function setConsent(consent) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

function loadGA4(measurementId) {
  if (!measurementId || measurementId.startsWith("G-XXXX")) return;

  // Load gtag script dynamically ONLY after consent
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
}

function applyConsent(consent) {
  // Add other trackers here later in the same pattern
  if (consent?.analytics === true) {
    loadGA4("G-XXXXXXXXXX"); // <-- put your GA4 id here when ready
  }
}

(function initCookieUI(){
  const banner = document.getElementById("cookie-banner");
  const modal = document.getElementById("cookie-modal");

  const acceptBtn = document.getElementById("cookie-accept-btn");
  const rejectBtn = document.getElementById("cookie-reject-btn");
  const settingsBtn = document.getElementById("cookie-settings-btn");
  const saveBtn = document.getElementById("cookie-save-btn");
  const cancelBtn = document.getElementById("cookie-cancel-btn");

  const analyticsToggle = document.getElementById("cookie-analytics");
  const marketingToggle = document.getElementById("cookie-marketing");

  if (!banner || !modal) return;

  const existing = getConsent();
  if (existing) {
    applyConsent(existing);
    return; // don’t show banner again
  }

  // Show banner (default: no tracking)
  banner.hidden = false;

  function closeAll() {
    banner.hidden = true;
    modal.hidden = true;
  }

  function openSettings() {
    // defaults off
    analyticsToggle.checked = false;
    marketingToggle.checked = false;
    modal.hidden = false;
  }

  acceptBtn?.addEventListener("click", () => {
    const consent = { necessary: true, analytics: true, marketing: false };
    setConsent(consent);
    closeAll();
    applyConsent(consent);
  });

  rejectBtn?.addEventListener("click", () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    setConsent(consent);
    closeAll();
    applyConsent(consent);
  });

  settingsBtn?.addEventListener("click", () => openSettings());

  saveBtn?.addEventListener("click", () => {
    const consent = {
      necessary: true,
      analytics: !!analyticsToggle.checked,
      marketing: !!marketingToggle.checked
    };
    setConsent(consent);
    closeAll();
    applyConsent(consent);
  });

  cancelBtn?.addEventListener("click", () => { modal.hidden = true; });

  // Click outside modal closes it
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.hidden = true;
  });
})();
