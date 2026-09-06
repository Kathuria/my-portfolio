import { X, ArrowUpRight, ExternalLink, Compass, Lock } from 'lucide-react';
import { NODES, CLUSTER_META, CORE, YOUTUBE_PLAYLISTS, ALEXA_SKILLS } from '../data/universe.js';

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

export default function DetailPanel({ nodeId, onClose }) {
  const isCore = nodeId === 'avi';
  const node = isCore ? null : NODES.find((n) => n.id === nodeId);
  if (!nodeId || (!isCore && !node)) return null;

  const color = isCore ? '#C9A24B' : CLUSTER_META[node.cluster].color;
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
  const destinationNote = !isCore && node?.destinationNote;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#0B0E14]/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-3xl flex-col overflow-hidden border-l"
        style={{
          background: '#F3ECD9',
          borderColor: '#C9A24B55',
          boxShadow: '-24px 0 60px rgba(0,0,0,0.35)',
        }}
      >
        <div className="flex items-start justify-between px-8 pt-8">
          {!isCore && (
            <span
              className="text-[11px] font-medium uppercase tracking-[0.12em]"
              style={{ color }}
            >
              {CLUSTER_META[node.cluster].label}
            </span>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#241a06]/15 text-[#241a06] hover:bg-[#241a06]/5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-6 pt-4 sm:px-8">
          <div className="shrink-0">
            <h2
              className="text-4xl leading-tight text-[#241a06]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {title}
            </h2>
            {tagline && <p className="mt-2 text-base text-[#5c4a22]">{tagline}</p>}

            <div className="my-5 h-px w-16" style={{ background: color }} />

            <p className="max-w-3xl text-[15px] leading-relaxed text-[#3a2f18]">{description}</p>

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
                  className="max-h-[48vh] w-auto max-w-full rounded-xl border-2 border-[#C9A24B]/50 object-contain shadow-lg"
                />
              </figure>
            )}

            {nodeImage && (
              <figure className="mt-6 overflow-hidden rounded-xl border border-[#241a06]/15 bg-[#e9dfc9] shadow-[0_10px_25px_rgba(36,26,6,0.12)]">
                <img src={nodeImage} alt="National parks visited by Avi" className="block max-h-[21rem] w-full object-cover" />
              </figure>
            )}

            {parkGroups && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {parkGroups.map(([state, parks]) => (
                  <section key={state} className="rounded-lg border border-[#241a06]/12 bg-[#f8f2e5] p-4">
                    <h3 className="text-sm font-semibold text-[#241a06]">{state}</h3>
                    <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#5c4a22]">
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
                      className="absolute -left-[1.74rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#F3ECD9]"
                      style={{ background: color }}
                    />
                    <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color }}>{period}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#3a2f18]">{event}</p>
                  </li>
                ))}
              </ol>
            )}

            {links && links.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
                    style={{ borderColor: `${color}66`, color: '#241a06' }}
                  >
                    {l.label}
                    <ArrowUpRight
                      size={16}
                      className="text-[#241a06]/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {previewLink && !noPreview && !embedBlocked && (
              <section className="mt-6 flex min-h-[19rem] flex-1 flex-col overflow-hidden rounded-xl border border-[#241a06]/15 bg-[#e9dfc9] shadow-[0_10px_25px_rgba(36,26,6,0.12)]">
                <div className="flex items-center justify-between border-b border-[#241a06]/10 bg-[#f8f2e5] px-3 py-2">
                  <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.13em] text-[#5c4a22]">
                    <Compass size={13} style={{ color }} /> Live destination
                  </span>
                  <a
                    href={previewLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#241a06] hover:underline"
                  >
                    Open externally <ExternalLink size={13} />
                  </a>
                </div>
                {(
                  <iframe
                    src={previewLink.url}
                    title={`${title} live preview`}
                    className="block min-h-[17rem] flex-1 w-full border-0 bg-[#f8f2e5]"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                )}
              </section>
          )}

          {embedBlocked && (
              <section className="mt-6 overflow-hidden rounded-xl border border-[#241a06]/15 bg-[#e9dfc9] shadow-[0_10px_25px_rgba(36,26,6,0.12)]">
                <div className="flex items-center gap-2 border-b border-[#241a06]/10 bg-[#f8f2e5] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.13em] text-[#5c4a22]">
                  <Lock size={13} style={{ color }} /> Can't be previewed here
                </div>
                <p className="px-4 py-4 text-[13px] leading-relaxed text-[#5c4a22]">
                  {destinationNote || 'This destination blocks itself from being framed by outside sites, so it opens directly instead.'}
                </p>
              </section>
          )}

          {playlists && (
            <section className="mt-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl text-[#241a06]">Public playlists</h3>
                <a href="https://www.youtube.com/@akuploader/playlists" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#5c4a22] hover:underline">Open on YouTube</a>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {playlists.map(([playlistTitle, playlistId, videoId]) => (
                  <a
                    key={playlistId}
                    href={`https://www.youtube.com/playlist?list=${playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group overflow-hidden rounded-lg border border-[#241a06]/15 bg-[#f8f2e5] text-left"
                  >
                    {videoId ? (
                      <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" className="aspect-video w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-[#d7c8aa] text-2xl">▶</div>
                    )}
                    <span className="block px-3 py-2 text-xs font-medium leading-snug text-[#241a06]">{playlistTitle}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {alexaSkills && (
            <section className="mt-6">
              <h3 className="font-serif text-2xl text-[#241a06]">Published skills</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {alexaSkills.map(([skillTitle, url, logo]) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 rounded-lg border border-[#241a06]/15 bg-[#f8f2e5] p-3 text-center"
                  >
                    <img
                      src={logo}
                      alt=""
                      className="h-16 w-16 object-contain transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="text-xs font-medium leading-snug text-[#241a06]">{skillTitle}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {isCore && (
            <button
              onClick={onClose}
              className="mt-8 rounded-lg px-5 py-3 text-sm font-medium text-[#F3ECD9]"
              style={{ background: color }}
            >
              Start exploring
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
