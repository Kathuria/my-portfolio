import { useEffect, useRef, useState } from 'react';
import { X, ArrowUpRight, ExternalLink, Compass, Star, Image as ImageIcon } from 'lucide-react';
import { NODES, CLUSTER_META, CORE, YOUTUBE_PLAYLISTS, ALEXA_SKILLS } from '../data/universe.js';
import GitHubStatsCard from './GitHubStatsCard.jsx';
import FlightMemory from './FlightMemory.jsx';

function StampBadge({ text, color }) {
  return (
    <span
      className="inline-flex -rotate-2 items-center rounded-full border-2 px-3 py-1 text-[11px] font-medium tracking-wide"
      style={{ borderColor: color, color, fontFamily: "'Fraunces', serif" }}
    >
      {text}
    </span>
  );
}

export default function DetailPanel({ nodeId, onClose, onPortfolioSlotChange }) {
  const isCore = nodeId === 'avi';
  const node = isCore ? null : NODES.find((n) => n.id === nodeId);
  const isPortfolio = node?.id === 'portfolio';
  const isFlightMemory = node?.flightMemory === true;
  const portfolioSlotRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isPortfolio && onPortfolioSlotChange) {
      onPortfolioSlotChange(portfolioSlotRef.current);
      return () => onPortfolioSlotChange(null);
    }
    return undefined;
  }, [isPortfolio, onPortfolioSlotChange]);

  useEffect(() => {
    if (!nodeId) return undefined;
    closeButtonRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nodeId, onClose]);

  if (!nodeId || (!isCore && !node)) return null;

  const color = isCore ? '#8a8ac4' : CLUSTER_META[node.cluster].textColor;
  const title = isCore ? CORE.title : node.title;
  const tagline = isCore ? null : node.tagline;
  const description = isCore ? CORE.description : node.description;
  const stats = isCore ? null : node.stats;
  const links = isCore ? null : node.links;
  const profileImage = isCore ? CORE.image : null;
  const nodeImage = isCore ? null : node.image;
  const timeline = isCore ? null : node.timeline;
  const parkGroups = isCore ? null : node.parkGroups;
  const playlists = node?.id === 'youtube' ? YOUTUBE_PLAYLISTS : null;
  const alexaSkills = node?.id === 'alexa-skills' ? ALEXA_SKILLS : null;
  const previewLink = links?.[0];
  const embedBlocked = !isCore && node?.embedBlocked;
  const noPreview = !isCore && node?.noPreview;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#1a1a2e]/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-x-0 bottom-0 top-0 z-50 flex h-full w-full flex-col overflow-hidden border-l sm:inset-x-auto sm:right-0 sm:max-w-3xl"
        style={{
          background: '#1a1a2e',
          borderColor: '#4a4a6d88',
          boxShadow: '-24px 0 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-start justify-between px-4 pt-6 sm:px-8 sm:pt-8">
          {!isCore && (
            <span
              className="text-[11px] font-medium uppercase tracking-[0.12em]"
              style={{ color }}
            >
              {CLUSTER_META[node.cluster].label}
            </span>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#eeeef5]/20 text-[#eeeef5] hover:bg-[#eeeef5]/10"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 pt-4 sm:px-8">
          <div className="shrink-0">
            <h2
              className="text-4xl leading-tight text-[#eeeef5]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {title}
            </h2>
            {tagline && <p className="mt-2 text-base text-[#c4c4d8]">{tagline}</p>}

            <div className="my-5 h-px w-16" style={{ background: color }} />

              <p className="max-w-3xl text-[15px] leading-relaxed text-[#c4c4d8]">{description}</p>

            {stats && stats.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {stats.map((s) => (
                  <StampBadge key={s} text={s} color={color} />
                ))}
              </div>
            )}

            {profileImage && (
              <figure className="mt-6 flex justify-center">
                <img
                  src={profileImage}
                  alt="Avi Kathuria"
                  loading="eager"
                  fetchPriority="high"
                  className="max-h-[48vh] w-auto max-w-full rounded-xl border-2 border-[#8a8ac4]/50 object-contain shadow-lg"
                />
              </figure>
            )}

            {nodeImage && (
              <figure className="mt-6 overflow-hidden rounded-xl border border-[#eeeef5]/15 bg-[#25253a] shadow-[0_10px_25px_rgba(36,26,6,0.12)]">
                <img src={nodeImage} alt="National parks visited by Avi" className="block max-h-[21rem] w-full object-cover" />
              </figure>
            )}

            {parkGroups && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {parkGroups.map(([state, parks]) => (
              <section key={state} className="rounded-lg border border-[#eeeef5]/12 bg-[#2f2f47] p-4">
                <h3 className="text-sm font-semibold text-[#eeeef5]">{state}</h3>
                <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#c4c4d8]">
                      {parks.map((park) => <li key={park}>✓ {park}</li>)}
                    </ul>
                  </section>
                ))}
              </div>
            )}

            {timeline && timeline.length > 0 && (
              <ol className="mt-6 border-l-2 pl-5" style={{ borderColor: `${color}99` }}>
                {timeline.map(([period, event]) => (
                  <li key={`${period}-${event}`} className="relative pb-4 last:pb-0">
                    <span
                      className="absolute -left-[1.74rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#1a1a2e]"
                      style={{ background: color }}
                    />
                    <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color }}>{period}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#c4c4d8]">{event}</p>
                  </li>
                ))}
              </ol>
            )}

            {links && links.length > 0 && node?.id !== 'google-maps' && (
              <div className="mt-5 flex flex-wrap gap-3">
                {links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                    style={{ borderColor: `${color}66`, color: '#eeeef5' }}
                  >
                    {l.label}
                    <ArrowUpRight
                      size={16}
                      className="text-[#eeeef5]/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {isPortfolio && (
            <section className="mt-6 flex min-h-[19rem] flex-1 flex-col overflow-hidden rounded-xl border border-[#eeeef5]/15 bg-[#25253a] shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between border-b border-[#eeeef5]/10 bg-[#2f2f47] px-3 py-2">
                <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.13em] text-[#c4c4d8]">
                  <Compass size={13} style={{ color }} /> Live destination
                </span>
                <a
                  href={previewLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#eeeef5] hover:underline"
                >
                  Open externally <ExternalLink size={13} />
                </a>
              </div>
                <div ref={portfolioSlotRef} className="min-h-[17rem] flex-1 w-full bg-[#2f2f47]" />
            </section>
          )}

          {previewLink && !isPortfolio && !noPreview && !embedBlocked && (
            <section className="mt-6 flex min-h-[19rem] flex-1 flex-col overflow-hidden rounded-xl border border-[#eeeef5]/15 bg-[#25253a] shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between border-b border-[#eeeef5]/10 bg-[#2f2f47] px-3 py-2">
                <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.13em] text-[#c4c4d8]">
                    <Compass size={13} style={{ color }} /> Live destination
                  </span>
                  <a
                    href={previewLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#eeeef5] hover:underline"
                  >
                    Open externally <ExternalLink size={13} />
                  </a>
                </div>
                {(
                  <iframe
                    src={previewLink.url}
                    title={`${title} live preview`}
                    className="block min-h-[17rem] flex-1 w-full border-0 bg-[#2f2f47]"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                )}
              </section>
          )}

          {node?.id === 'engineering' && node.githubUser && (
            <GitHubStatsCard username={node.githubUser} color={color} />
          )}

          {node?.id === 'google-maps' && links && node.metricBlocks && (
            <section className="mt-6">
              <div className="grid grid-cols-2 gap-3">
                {links.map((l, i) => {
                  const m = node.metricBlocks[i];
                  return (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-1.5 rounded-xl border border-[#eeeef5]/15 bg-[#2f2f47] p-5 text-center transition-transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.13em] text-[#c4c4d8]">
                        {i === 0 ? <Star size={13} style={{ color }} aria-hidden="true" /> : <ImageIcon size={13} style={{ color }} aria-hidden="true" />}
                        {l.label}
                      </span>
                      <span className="font-serif text-2xl leading-none text-[#eeeef5] sm:text-3xl">{m?.value}</span>
                      <span className="text-xs font-medium text-[#c4c4d8]">{m?.label}</span>
                      {m?.detail && <span className="mt-1 text-[11px] text-[#c4c4d8]">{m.detail}</span>}
                    </a>
                  );
                })}
              </div>
              {node.profileLink && (
                <a
                  href={node.profileLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-3 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                  style={{ borderColor: `${color}66`, color: '#eeeef5' }}
                >
                  {node.profileLink.label}
                  <ArrowUpRight
                    size={16}
                    className="text-[#eeeef5]/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              )}
            </section>
          )}

          {node?.profiles && (
            <section className="mt-6 flex flex-col gap-3">
              {node.profiles.map((p) => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-[#eeeef5]/15 bg-[#2f2f47] p-4 shadow-[0_10px_25px_rgba(36,26,6,0.12)] transition-transform hover:-translate-y-0.5"
                >
                  {p.coverImage ? (
                    <img
                      src={p.coverImage}
                      alt=""
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-full border-2 object-cover"
                      style={{ borderColor: color }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 font-serif text-lg"
                      style={{ borderColor: color, color }}
                      aria-hidden="true"
                    >
                      {p.label.slice(0, 1)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[#eeeef5]">{p.label}</span>
                    <span className="block truncate text-xs text-[#c4c4d8]">{p.tagline}</span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-[#eeeef5]/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </section>
          )}

          {playlists && (
            <section className="mt-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl text-[#eeeef5]">Public playlists</h3>
                <a href="https://www.youtube.com/@akuploader/playlists" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#c4c4d8] hover:underline">Open on YouTube</a>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {playlists.map(([playlistTitle, playlistId, videoId]) => (
                  <a
                    key={playlistId}
                    href={`https://www.youtube.com/playlist?list=${playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-lg border border-[#eeeef5]/15 bg-[#2f2f47] text-left"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-[#2a2a40]">
                      {videoId ? (
                        <img 
                          src={`https://img.youtube.com/vi/${videoId}/0.jpg`} 
                          alt="" 
                          className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#8a8ac4]/40">▶</div>
                    </div>
                    <span className="block px-3 py-2 text-xs font-medium leading-snug text-[#eeeef5]">{playlistTitle}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {alexaSkills && (
            <section className="mt-6">
              <h3 className="font-serif text-2xl text-[#eeeef5]">Published skills</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {alexaSkills.map(([skillTitle, url, logo]) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 rounded-lg border border-[#eeeef5]/15 bg-[#2f2f47] p-3 text-center"
                  >
                    <img
                      src={logo}
                      alt=""
                      className="h-16 w-16 object-contain transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="text-xs font-medium leading-snug text-[#eeeef5]">{skillTitle}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {isCore && (
            <button
              onClick={onClose}
              className="mt-8 rounded-lg px-5 py-3 text-sm font-medium text-[#1a1a2e]"
              style={{ background: color }}
            >
              Start exploring
            </button>
          )}

          {/* Flight Memory - Inline Globe Experience */}
          {isFlightMemory && <FlightMemory color={color} />}
        </div>
      </aside>
    </>
  );
}
