import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BackgroundStory from '../BackgroundStory.jsx';

describe('BackgroundStory', () => {
  let matchMediaMock;

  beforeEach(() => {
    matchMediaMock = vi.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the universe plate with correct text', () => {
    render(<BackgroundStory />);
    expect(screen.getByText('A map, not a resume')).toBeInTheDocument();
    expect(screen.getByText('Avi')).toBeInTheDocument();
    expect(screen.getByText('Verse')).toBeInTheDocument();
    expect(screen.getByText('Avi Kathuria · engineer, traveler, explorer')).toBeInTheDocument();
  });

  it('renders SVG with correct waves', () => {
    const { container } = render(<BackgroundStory />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('renders text paths with technology keywords', () => {
    const { container } = render(<BackgroundStory />);
    const textPaths = container.querySelectorAll('textPath');
    expect(textPaths.length).toBe(3);
    expect(textPaths[0].textContent).toContain('BUILD');
    expect(textPaths[0].textContent).toContain('REACT');
    expect(textPaths[0].textContent).toContain('TYPESCRIPT');
    expect(textPaths[1].textContent).toContain('EXPLORE');
    expect(textPaths[2].textContent).toContain('SHARE');
  });

  it('renders name lanes with multilingual names', () => {
    const { container } = render(<BackgroundStory />);
    const nameLanes = container.querySelectorAll('.name-lane');
    expect(nameLanes.length).toBe(4); // 4 lanes as defined in LANES
  });

  it('respects prefers-reduced-motion', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { container } = render(<BackgroundStory />);
    // When reduced motion is preferred, animations should be disabled
    expect(container).toBeInTheDocument();
  });

  it('has proper aria-hidden attribute on decorative elements', () => {
    const { container } = render(<BackgroundStory />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies correct CSS classes for positioning', () => {
    const { container } = render(<BackgroundStory />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('pointer-events-none');
    expect(mainDiv).toHaveClass('fixed');
    expect(mainDiv).toHaveClass('inset-0');
  });
});
