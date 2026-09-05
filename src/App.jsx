import { useEffect, useState } from 'react';
import Starfield from './components/Starfield.jsx';
import BackgroundStory from './components/BackgroundStory.jsx';
import UniverseGraph from './components/UniverseGraph.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import IntroOverlay from './components/IntroOverlay.jsx';
import ContactDock from './components/ContactDock.jsx';
import LegacyApp from './legacy/LegacyApp.jsx';
import { NODES } from './data/universe.js';

const VALID_IDS = new Set(['avi', ...NODES.map((n) => n.id)]);

function readHash() {
  const id = window.location.hash.replace('#', '');
  return VALID_IDS.has(id) ? id : null;
}

export default function App() {
  const isLegacy = window.location.pathname === '/legacy' || window.location.pathname === '/legacy/' || new URLSearchParams(window.location.search).get('view') === 'legacy';
  if (isLegacy) return <LegacyApp />;
  return <AviVerse />;
}

function AviVerse() {
  const [activeId, setActiveId] = useState(readHash);
  // The landing composition itself explains the site. Help remains available
  // from the dock without covering the first view with an onboarding modal.
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const onHashChange = () => setActiveId(readHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    // Gamma is a third-party document, so it cannot be copied into our own
    // cache. Warming the browser cache on arrival makes the Portfolio star
    // substantially faster when it is opened later.
    const preload = document.createElement('link');
    preload.rel = 'prefetch';
    preload.as = 'document';
    preload.href = 'https://avikathuria-portfolio-ymlhrik.gamma.site/';
    document.head.appendChild(preload);
    return () => preload.remove();
  }, []);

  const select = (id) => {
    window.location.hash = id;
    setActiveId(id);
  };

  const close = () => {
    history.pushState('', document.title, window.location.pathname + window.location.search);
    setActiveId(null);
  };

  const dismissIntro = () => {
    localStorage.setItem('avi-universe-visited', '1');
    setShowIntro(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0E14] text-[#F2EFE6]">
      <Starfield />
      <BackgroundStory />
      <UniverseGraph onSelect={select} activeId={activeId} />
      <ContactDock onHelp={() => setShowIntro(true)} />
      <DetailPanel nodeId={activeId} onClose={close} />
      {showIntro && <IntroOverlay onDismiss={dismissIntro} />}
    </div>
  );
}
