import { useEffect, useState } from 'react';
import { GitFork, Users, Star } from 'lucide-react';

// GitHub's public REST API is unauthenticated-friendly and CORS-open, so this
// fetches real numbers at view time. GitHub doesn't expose a clean public API
// for the contribution graph itself, so repos/followers/top-starred-repo
// stand in as the "whatever GitHub exposes publicly" version of that.
export default function GitHubStatsCard({ username, color }) {
  const [profile, setProfile] = useState(null);
  const [topRepo, setTopRepo] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`https://api.github.com/users/${username}/repos?sort=stargazers_count&per_page=1`).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      ),
    ])
      .then(([userJson, reposJson]) => {
        if (cancelled) return;
        setProfile(userJson);
        setTopRepo(Array.isArray(reposJson) ? reposJson[0] : null);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  // Rate-limited or offline: the CTA link above already covers this node,
  // so just stay quiet rather than showing an error state.
  if (status === 'error') return null;

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-[#241a06]/15 bg-[#f8f2e5] shadow-[0_10px_25px_rgba(36,26,6,0.12)]">
      <div className="flex items-center gap-2 border-b border-[#241a06]/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.13em] text-[#5c4a22]">
        <GitFork size={13} style={{ color }} /> Live from GitHub
      </div>
      <div className="flex items-center gap-4 p-4">
        {status === 'ready' ? (
          <img
            src={profile.avatar_url}
            alt=""
            className="h-16 w-16 shrink-0 rounded-full border-2"
            style={{ borderColor: color }}
          />
        ) : (
          <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-[#241a06]/10" />
        )}
        <div className="min-w-0 flex-1">
          {status === 'ready' ? (
            <>
              <p className="truncate text-sm text-[#3a2f18]">{profile.bio || `@${profile.login} on GitHub`}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#241a06]">
                <span className="inline-flex items-center gap-1.5">
                  <GitFork size={14} /> <strong>{profile.public_repos}</strong> repos
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={14} /> <strong>{profile.followers}</strong> followers
                </span>
                {topRepo && (
                  <span className="inline-flex items-center gap-1.5">
                    <Star size={14} /> <strong>{topRepo.stargazers_count}</strong> on {topRepo.name}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-[#241a06]/10" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[#241a06]/10" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
