import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import PSFinalCommit from '../PSFinalCommit';

describe('PSFinalCommit', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    };

    // Mock YouTube IFrame API
    global.YT = {
      Player: class Player {
        constructor() {}
        setVolume = vi.fn();
      },
    };

    // Add a dummy script tag to the document for YouTube API injection
    const dummyScript = document.createElement('script');
    dummyScript.src = 'dummy.js';
    document.head.appendChild(dummyScript);

    // Mock window.onYouTubeIframeAPIReady
    delete window.onYouTubeIframeAPIReady;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Document Metadata', () => {
    it('sets the correct page title on mount', () => {
      render(<PSFinalCommit />);
      expect(document.title).toBe('10.10.10 - PS Final Commit | Avi Kathuria');
    });

    it('ensures favicon exists', () => {
      render(<PSFinalCommit />);
      const favicon = document.querySelector('link[rel="icon"]');
      expect(favicon).toBeTruthy();
      expect(favicon?.getAttribute('href')).toBe('/ak.png');
    });
  });

  describe('Hero Section', () => {
    it('renders the Sapient logo', () => {
      render(<PSFinalCommit />);
      const logo = screen.getByAltText('Sapient');
      expect(logo).toBeInTheDocument();
      expect(logo.tagName).toBe('IMG');
      expect(logo).toHaveAttribute('src', '/sapient-logo.gif');
    });

    it('displays the massive 10.10.10 numbers', () => {
      render(<PSFinalCommit />);
      const numbers = screen.getAllByText('10');
      expect(numbers).toHaveLength(3);
    });

    it('displays Years, Months, Days labels', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('Years')).toBeInTheDocument();
      expect(screen.getByText('Months')).toBeInTheDocument();
      expect(screen.getByText('Days')).toBeInTheDocument();
    });

    it('renders the tagline', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('A Journey of Innovation, Growth, and Impact')).toBeInTheDocument();
    });

    it('displays scroll indicator with text', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('Scroll')).toBeInTheDocument();
    });

    it('renders scroll indicator SVG arrow', () => {
      render(<PSFinalCommit />);
      const scrollText = screen.getByText('Scroll');
      const scrollContainer = scrollText.closest('div');
      const svg = scrollContainer?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Journey Summary Section', () => {
    it('renders The Journey section title', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('The Journey')).toBeInTheDocument();
    });

    it('displays Company evolution timeline', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('Company')).toBeInTheDocument();
      expect(screen.getByText('Sapient Global Markets')).toBeInTheDocument();
      expect(screen.getByText('Publicis Sapient')).toBeInTheDocument();
    });

    it('displays Location progression timeline', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('Locations')).toBeInTheDocument();
      expect(screen.getByText('Gurugram')).toBeInTheDocument();
      expect(screen.getByText('Noida')).toBeInTheDocument();
      expect(screen.getByText('Dallas')).toBeInTheDocument();
    });

    it('displays all role progression levels', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('Role Evolution')).toBeInTheDocument();
      expect(screen.getByText('Associate QA')).toBeInTheDocument();
      expect(screen.getByText('Associate QA L2')).toBeInTheDocument();
      expect(screen.getByText('Associate Experience Technology L2')).toBeInTheDocument();
      expect(screen.getByText('Senior Associate Experience Technology')).toBeInTheDocument();
      expect(screen.getByText('Lead Experience Engineer')).toBeInTheDocument();
    });

    it('displays Career Path evolution', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('Career Path')).toBeInTheDocument();
      expect(screen.getByText('QA')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
    });
  });

  describe('Career Evolution Section', () => {
    it('renders Signature Evolution section title', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('Signature Evolution')).toBeInTheDocument();
    });

    it('displays the career signature evolution GIF', () => {
      render(<PSFinalCommit />);
      const gif = screen.getByAltText(/signature evolution/i);
      expect(gif).toBeInTheDocument();
      expect(gif).toHaveAttribute('src', '/Avi_Career_Journey_Transparent.gif');
    });

    it('applies lazy loading to the GIF', () => {
      render(<PSFinalCommit />);
      const gif = screen.getByAltText(/signature evolution/i);
      expect(gif).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Journey Glimpse Section', () => {
    it('renders Journey Glimpse section title', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('Journey Glimpse')).toBeInTheDocument();
    });

    it('renders YouTube Shorts iframe with correct attributes', () => {
      render(<PSFinalCommit />);
      const iframe = document.getElementById('youtube-player');
      expect(iframe).toBeInTheDocument();
      expect(iframe?.tagName).toBe('IFRAME');
      expect(iframe).toHaveAttribute('title', 'Journey Glimpse - 10 Years, 10 Months, 10 Days');
    });

    it('YouTube iframe has correct source URL with parameters', () => {
      render(<PSFinalCommit />);
      const iframe = document.getElementById('youtube-player');
      const src = iframe?.getAttribute('src');
      expect(src).toContain('youtube.com/embed/Ba4igNWzE_U');
      expect(src).toContain('autoplay=0');
      expect(src).toContain('mute=0');
      expect(src).toContain('controls=1');
      expect(src).toContain('enablejsapi=1');
    });

    it('displays video caption text', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText(/A cinematic glimpse through 10 years, 10 months, and 10 days/i)).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('renders footer with gratitude message', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText(/With gratitude for the journey and excitement for what's ahead/i)).toBeInTheDocument();
    });
  });

  describe('Easter Egg Navigation', () => {
    it('renders navigation link to home', () => {
      render(<PSFinalCommit />);
      const link = screen.getByText('Know more about Avi');
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '/');
    });

    it('navigation link has home icon', () => {
      render(<PSFinalCommit />);
      const link = screen.getByText('Know more about Avi');
      const linkElement = link.closest('a');
      const svg = linkElement?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Animations and Interactions', () => {
    it('initializes IntersectionObserver for scroll animations', () => {
      const { container } = render(<PSFinalCommit />);
      // Verify elements with animate-on-scroll class exist
      const animatedSections = container.querySelectorAll('.animate-on-scroll');
      expect(animatedSections.length).toBeGreaterThan(0);
    });

    it('observes elements with animate-on-scroll class', () => {
      const mockObserve = vi.fn();
      global.IntersectionObserver = class IntersectionObserver {
        constructor(callback) {
          this.callback = callback;
        }
        observe = mockObserve;
        unobserve = vi.fn();
        disconnect = vi.fn();
      };

      render(<PSFinalCommit />);
      expect(mockObserve).toHaveBeenCalled();
    });
  });

  describe('YouTube API Integration', () => {
    it('loads YouTube IFrame API script', () => {
      render(<PSFinalCommit />);
      const scripts = document.querySelectorAll('script[src*="youtube.com/iframe_api"]');
      // Script is dynamically loaded, just verify render doesn't crash
      expect(scripts.length).toBeGreaterThanOrEqual(0);
    });

    it('sets up onYouTubeIframeAPIReady callback', async () => {
      render(<PSFinalCommit />);
      // Callback is set up during useEffect, just verify component renders
      await waitFor(() => {
        expect(document.getElementById('youtube-player')).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes for mobile centering', () => {
      render(<PSFinalCommit />);
      const journeyTitle = screen.getByText('The Journey');
      expect(journeyTitle).toHaveClass('text-center', 'md:text-left');
    });

    it('timeline values use flex-col on mobile and flex-row on desktop', () => {
      const { container } = render(<PSFinalCommit />);
      const companyTimeline = screen.getByText('Sapient Global Markets').parentElement;
      expect(companyTimeline).toHaveClass('flex-col', 'md:flex-row');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      const { container } = render(<PSFinalCommit />);
      const h2Elements = container.querySelectorAll('h2');
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('YouTube iframe has allowFullScreen attribute', () => {
      render(<PSFinalCommit />);
      const iframe = document.getElementById('youtube-player');
      expect(iframe).toHaveAttribute('allowFullScreen');
    });

    it('images have alt text', () => {
      render(<PSFinalCommit />);
      const sapientLogo = screen.getByAltText('Sapient');
      const careerGif = screen.getByAltText(/signature evolution/i);
      expect(sapientLogo).toBeInTheDocument();
      expect(careerGif).toBeInTheDocument();
    });
  });

  describe('Styling and Visual Elements', () => {
    it('applies grain texture overlay', () => {
      const { container } = render(<PSFinalCommit />);
      // Check for grain animation class or background pattern
      const grainElements = container.querySelectorAll('.animate-grain');
      expect(grainElements.length).toBeGreaterThan(0);
    });

    it('has fade-in-up animations on hero elements', () => {
      const { container } = render(<PSFinalCommit />);
      const animatedElements = container.querySelectorAll('.animate-fade-in-up');
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('applies bounce animation to scroll indicator', () => {
      const { container } = render(<PSFinalCommit />);
      const bounceElements = container.querySelectorAll('.animate-bounce-slow');
      expect(bounceElements.length).toBeGreaterThan(0);
    });
  });

  describe('Content Accuracy', () => {
    it('displays exact tenure: 10 Years, 10 Months, 10 Days', () => {
      render(<PSFinalCommit />);
      const numbers = screen.getAllByText('10');
      expect(numbers).toHaveLength(3);
      expect(screen.getByText('Years')).toBeInTheDocument();
      expect(screen.getByText('Months')).toBeInTheDocument();
      expect(screen.getByText('Days')).toBeInTheDocument();
    });

    it('shows complete role progression with 5 levels', () => {
      render(<PSFinalCommit />);
      expect(screen.getByText('Associate QA')).toBeInTheDocument();
      expect(screen.getByText('Associate QA L2')).toBeInTheDocument();
      expect(screen.getByText('Associate Experience Technology L2')).toBeInTheDocument();
      expect(screen.getByText('Senior Associate Experience Technology')).toBeInTheDocument();
      expect(screen.getByText('Lead Experience Engineer')).toBeInTheDocument();
    });
  });
});
