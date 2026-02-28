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
