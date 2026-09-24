import { useEffect, useState } from 'react';
import Starfield from './components/Starfield.jsx';
import BackgroundStory from './components/BackgroundStory.jsx';
import UniverseGraph from './components/UniverseGraph.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import IntroOverlay from './components/IntroOverlay.jsx';
import ContactDock from './components/ContactDock.jsx';
import PortfolioPreview from './components/PortfolioPreview.jsx';
import SkillSpotlight from './components/SkillSpotlight.jsx';
import LegacyApp from './legacy/LegacyApp.jsx';
import PSFinalCommit from './PSFinalCommit.jsx';
import { NODES } from './data/universe.js';

const VALID_IDS = new Set(['avi', ...NODES.map((n) => n.id)]);

function readHash() {
  const id = window.location.hash.replace('#', '');
  return VALID_IDS.has(id) ? id : null;
}

export default function App() {
  const isPSFinalCommit = window.location.pathname === '/ps-final-commit' || window.location.pathname === '/ps-final-commit/';
  if (isPSFinalCommit) return <PSFinalCommit />;
  
  const isLegacy = window.location.pathname === '/legacy' || window.location.pathname === '/legacy/' || new URLSearchParams(window.location.search).get('view') === 'legacy';
  if (isLegacy) return <LegacyApp />;
  
  return <AviVerse />;
}

function AviVerse() {
  const [activeId, setActiveId] = useState(readHash);
  // The landing composition itself explains the site. Help remains available
  // from the dock without covering the first view with an onboarding modal.
  const [showIntro, setShowIntro] = useState(false);

  // Preload flight data in background for faster Flight Memory experience
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Preload flight data when browser is idle
        import('./data/flights.generated.json').catch(() => {
          // Silent fail - will load on-demand if preload fails
        });
      }, { timeout: 5000 });
    }
  }, []);
  const [portfolioSlot, setPortfolioSlot] = useState(null);

  useEffect(() => {
    const onHashChange = () => setActiveId(readHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
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

  // While a modal or drawer is open, the graph itself should be inert so it
  // can never intercept a click meant for something stacked above it.
  const graphPaused = showIntro || !!activeId;

  return (
    <main id="main-content" tabIndex={-1} className="h-screen w-screen overflow-hidden bg-[#0B0E14] text-[#F2EFE6]">
      <Starfield />
      <BackgroundStory />
      <UniverseGraph onSelect={select} activeId={activeId} paused={graphPaused} />
      <ContactDock onHelp={() => setShowIntro(true)} />
      <PortfolioPreview mountNode={portfolioSlot} />
      <SkillSpotlight hidden={graphPaused} />
      <DetailPanel nodeId={activeId} onClose={close} onPortfolioSlotChange={setPortfolioSlot} />
      {showIntro && <IntroOverlay onDismiss={dismissIntro} />}
    </main>
  );
}
