/**
 * GDPR-Compliant Cookie Consent Manager
 * - Loads only essential cookies by default
 * - Delays analytics scripts until consent is given
 * - Stores user preferences across sessions
 */

(function () {
  "use strict";

  const CONSENT_KEY = "cookie_consent";
  const CONSENT_EXPIRY_DAYS = 365;

  const CookieConsent = {
    init() {
      // Check if user has already made a choice
      const consent = this.getConsent();

      if (consent === null) {
        // No consent stored - show banner
        this.showBanner();
      } else if (consent === "accepted") {
        // User accepted - load analytics
        this.loadAnalytics();
      }
      // If rejected, do nothing (no analytics loaded)
    },

    showBanner() {
      const banner = document.createElement("div");
      banner.id = "cookie-consent-banner";
      banner.setAttribute("role", "dialog");
      banner.setAttribute("aria-labelledby", "cookie-consent-title");
      banner.setAttribute("aria-describedby", "cookie-consent-desc");
      banner.innerHTML = `
        <div style="
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: var(--swiss-black);
          color: var(--swiss-white);
          padding: var(--space-lg) var(--space-xl);
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
          z-index: 9999;
          border-top: 3px solid var(--swiss-red);
        ">
          <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-md);">
            <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
              <h2 id="cookie-consent-title" style="font-size: 1.125rem; font-weight: 700; margin: 0;">
                Cookie Preferences
              </h2>
              <p id="cookie-consent-desc" style="font-size: 0.875rem; color: var(--swiss-gray-300); margin: 0; max-width: 800px;">
                We use cookies to improve your experience. Essential cookies are always enabled. 
                Analytics cookies help us understand how you use our site. 
                <a href="/privacy/" style="color: var(--swiss-white); text-decoration: underline;">Read our Privacy Policy</a>
              </p>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-md); align-items: center;">
              <button id="cookie-accept" style="
                padding: 0.75rem 1.5rem;
                background-color: var(--swiss-white);
                color: var(--swiss-black);
                border: 2px solid var(--swiss-white);
                font-weight: 700;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                cursor: pointer;
                transition: all 0.2s;
              ">
                Accept All
              </button>
              <button id="cookie-reject" style="
                padding: 0.75rem 1.5rem;
                background-color: transparent;
                color: var(--swiss-white);
                border: 2px solid var(--swiss-white);
                font-weight: 700;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                cursor: pointer;
                transition: all 0.2s;
              ">
                Reject All
              </button>
              <a href="/privacy/" style="
                padding: 0.75rem 1.5rem;
                color: var(--swiss-white);
                text-decoration: underline;
                font-size: 0.875rem;
                font-weight: 500;
              ">
                Manage Preferences
              </a>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(banner);

      // Event listeners
      document.getElementById("cookie-accept").addEventListener("click", () => {
        this.saveConsent("accepted");
        this.loadAnalytics();
        this.removeBanner();
      });

      document.getElementById("cookie-reject").addEventListener("click", () => {
        this.saveConsent("rejected");
        this.removeBanner();
      });
    },

    removeBanner() {
      const banner = document.getElementById("cookie-consent-banner");
      if (banner) {
        banner.remove();
      }
    },

    saveConsent(choice) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + CONSENT_EXPIRY_DAYS);

      const consentData = {
        choice: choice,
        timestamp: new Date().toISOString(),
        expiry: expiry.toISOString(),
      };

      localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
    },

    getConsent() {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) return null;

      try {
        const data = JSON.parse(stored);
        const expiry = new Date(data.expiry);

        // Check if consent has expired
        if (new Date() > expiry) {
          localStorage.removeItem(CONSENT_KEY);
          return null;
        }

        return data.choice;
      } catch (e) {
        return null;
      }
    },

    loadAnalytics() {
      // Placeholder for analytics loading
      // When you add Google Analytics or similar:
      // 1. Add GA4 script tag dynamically
      // 2. Initialize tracking

      // Example:
      // const script = document.createElement('script');
      // script.async = true;
      // script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      // document.head.appendChild(script);

      console.log("[Cookie Consent] Analytics consent granted - ready to load tracking scripts");
    },
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => CookieConsent.init());
  } else {
    CookieConsent.init();
  }
})();
