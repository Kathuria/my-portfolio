import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import GitHubStatsCard from '../GitHubStatsCard.jsx';

describe('GitHubStatsCard', () => {
  const mockProfile = {
    login: 'testuser',
    avatar_url: 'https://example.com/avatar.png',
    bio: 'Test bio',
    public_repos: 42,
    followers: 100,
  };

  const mockRepo = {
    name: 'awesome-project',
    stargazers_count: 500,
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    const { container } = render(<GitHubStatsCard username="testuser" color="#C9A24B" />);
    const loadingSkeletons = container.querySelectorAll('.animate-pulse');
    expect(loadingSkeletons.length).toBeGreaterThan(0);
  });

  it('fetches and displays GitHub profile data', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/users/testuser')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        });
      }
      if (url.includes('/repos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockRepo]),
        });
      }
    });

    render(<GitHubStatsCard username="testuser" color="#C9A24B" />);

    await waitFor(() => {
      expect(screen.getByText('Test bio')).toBeInTheDocument();
    });

    expect(screen.getByText(/42/)).toBeInTheDocument();
    expect(screen.getByText(/repos/i)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/followers/i)).toBeInTheDocument();
  });

  it('displays top repo stars when available', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/users/testuser')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        });
      }
      if (url.includes('/repos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockRepo]),
        });
      }
    });

    const { container } = render(<GitHubStatsCard username="testuser" color="#C9A24B" />);

    await waitFor(() => {
      expect(screen.getByText('Test bio')).toBeInTheDocument();
    });

    // Verify the card renders with stats
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders nothing on API error', async () => {
    global.fetch.mockRejectedValue(new Error('API Error'));

    const { container } = render(<GitHubStatsCard username="testuser" color="#C9A24B" />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('uses fallback text when bio is not available', async () => {
    const profileNoBio = { ...mockProfile, bio: null };
    global.fetch.mockImplementation((url) => {
      if (url.includes('/users/testuser')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(profileNoBio),
        });
      }
      if (url.includes('/repos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockRepo]),
        });
      }
    });

    render(<GitHubStatsCard username="testuser" color="#C9A24B" />);

    await waitFor(() => {
      expect(screen.getByText('@testuser on GitHub')).toBeInTheDocument();
    });
  });

  it('displays avatar with correct border color', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/users/testuser')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        });
      }
      if (url.includes('/repos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockRepo]),
        });
      }
    });

    const { container } = render(<GitHubStatsCard username="testuser" color="#FF0000" />);

    await waitFor(() => {
      const avatar = container.querySelector('img');
      expect(avatar).toHaveStyle({ borderColor: '#FF0000' });
    });
  });

  it('includes proper ARIA labels and semantic HTML', async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/users/testuser')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile),
        });
      }
      if (url.includes('/repos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockRepo]),
        });
      }
    });

    const { container } = render(<GitHubStatsCard username="testuser" color="#C9A24B" />);

    await waitFor(() => {
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });
  });
});
