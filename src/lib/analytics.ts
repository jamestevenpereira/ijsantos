const COOKIE_CONSENT_KEY = "ijs.cookie-consent.v1";

type CookiePrefs = {
  analytics?: boolean;
};

export function trackGaEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    const prefs = raw ? (JSON.parse(raw) as CookiePrefs) : null;
    if (!prefs?.analytics) return;
  } catch {
    return;
  }

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
  };

  if (!w.gtag) return;
  w.gtag("event", eventName, params ?? {});
}
