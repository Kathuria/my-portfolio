import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const GAMMA_URL = 'https://avikathuria-portfolio-ymlhrik.gamma.site/';

function makeHost() {
  const el = document.createElement('div');
  el.style.width = '100%';
  el.style.height = '100%';
  return el;
}

function makeFallback() {
  const el = document.createElement('div');
  Object.assign(el.style, {
    position: 'fixed',
    left: '-99999px',
    top: '0',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  });
  return el;
}

// Mounted once at the App root and never unmounted. The iframe inside it
// starts loading the moment the site loads and stays alive in the
// background the whole time. When the Portfolio drawer is open, `mountNode`
// points at a placeholder inside DetailPanel and we move this SAME iframe
// element there (a real DOM move, not a re-render), so no new network
// request happens and the drawer opens instantly. When the drawer closes,
// the iframe moves back into an invisible off-screen host so it keeps
// running rather than being destroyed.
export default function PortfolioPreview({ mountNode }) {
  const [host] = useState(makeHost);
  const [fallback] = useState(makeFallback);

  useEffect(() => {
    document.body.appendChild(fallback);
    return () => fallback.remove();
  }, [fallback]);

  useEffect(() => {
    const target = mountNode || fallback;
    target.appendChild(host);
  }, [mountNode, fallback, host]);

  return createPortal(
    <iframe
      src={GAMMA_URL}
      title="Portfolio live preview"
      style={{ width: '100%', height: '100%', border: 0, display: 'block', background: '#f8f2e5' }}
      referrerPolicy="strict-origin-when-cross-origin"
    />,
    host
  );
}
