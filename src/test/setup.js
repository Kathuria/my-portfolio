import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Components like GitHubStatsCard fetch on mount. Tests shouldn't depend on
// real network access — default to a failed response so those components
// fall back to their "quiet, no card" state; individual tests can override
// this with their own vi.stubGlobal('fetch', ...) if they need to assert on
// the live-data path.
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, status: 503 })));

// jsdom doesn't implement matchMedia — several components check
// prefers-reduced-motion, so provide a default (motion allowed) unless a
// test overrides it.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom doesn't implement scrollTo/requestAnimationFrame fully in older
// versions — harmless no-op fallbacks so component effects don't throw.
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  window.cancelAnimationFrame = (id) => clearTimeout(id);
}
