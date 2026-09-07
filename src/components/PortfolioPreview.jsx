import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

const GAMMA_URL = 'https://avikathuria-portfolio-ymlhrik.gamma.site/';
// If the always-warm iframe hasn't fired a load event by the time someone
// actually opens the drawer, assume it may have been frozen in the
// background (a known WebKit/iOS behavior for iframes parked far outside
// the viewport) and force a fresh load as a safety net.
const STALL_TIMEOUT_MS = 6000;

function makeHost() {
  const el = document.createElement('div');
  el.style.width = '100%';
  el.style.height = '100%';
  return el;
}

function makeFallback() {
  const el = document.createElement('div');
  // Kept inside the viewport's paint area (top-left, 1x1px, invisible via
  // opacity) rather than translated thousands of pixels off-screen — mobile
  // Safari is more likely to suspend/rendering-freeze content it considers
  // fully outside the visible area, so staying technically "on screen"
  // (just invisible) is safer for keeping the iframe genuinely warm.
  Object.assign(el.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    opacity: '0',
    pointerEvents: 'none',
  });
  return el;
}

// Mounted once at the App root and never unmounted. The iframe inside it
// starts loading the moment the site loads and stays alive in the
// background the whole time. When the Portfolio drawer is open, `mountNode`
// points at a placeholder inside DetailPanel and we move this SAME iframe
// element there (a real DOM move, not a re-render), so no new network
// request happens and the drawer opens instantly in the common case. If the
// background copy stalled (see STALL_TIMEOUT_MS above), a fresh load is
// kicked off as a fallback so the drawer never just shows a blank panel.
export default function PortfolioPreview({ mountNode }) {
  const [host] = useState(makeHost);
  const [fallback] = useState(makeFallback);
  const [reloadKey, setReloadKey] = useState(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    document.body.appendChild(fallback);
    return () => fallback.remove();
  }, [fallback]);

  useEffect(() => {
    const target = mountNode || fallback;
    target.appendChild(host);
  }, [mountNode, fallback, host]);

  useEffect(() => {
    if (!mountNode) return undefined;
    const timer = setTimeout(() => {
      if (!loadedRef.current) setReloadKey((k) => k + 1);
    }, STALL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [mountNode]);

  return createPortal(
    <iframe
      key={reloadKey}
      src={GAMMA_URL}
      title="Portfolio live preview"
      onLoad={() => {
        loadedRef.current = true;
      }}
      style={{ width: '100%', height: '100%', border: 0, display: 'block', background: '#f8f2e5' }}
      referrerPolicy="strict-origin-when-cross-origin"
    />,
    host
  );
}
