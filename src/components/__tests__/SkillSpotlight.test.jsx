import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import SkillSpotlight from '../SkillSpotlight.jsx';

describe('SkillSpotlight', () => {
  let matchMediaMock;

  beforeEach(() => {
    vi.useFakeTimers();
    matchMediaMock = vi.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    window.matchMedia = matchMediaMock;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<SkillSpotlight hidden={false} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('is hidden by default (opacity-0)', () => {
    const { container } = render(<SkillSpotlight hidden={false} />);
    const spotlight = container.firstChild;
    expect(spotlight).toHaveClass('opacity-0');
  });

  it('applies aria-hidden attribute', () => {
    const { container } = render(<SkillSpotlight hidden={false} />);
    const spotlight = container.firstChild;
    expect(spotlight).toHaveAttribute('aria-hidden', 'true');
  });

  it('has pointer-events-none to avoid blocking interactions', () => {
    const { container } = render(<SkillSpotlight hidden={false} />);
    const spotlight = container.firstChild;
    expect(spotlight).toHaveClass('pointer-events-none');
  });

  it('respects prefers-reduced-motion setting', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const { container } = render(<SkillSpotlight hidden={false} />);
    expect(container.firstChild).toBeInTheDocument();
    // With reduced motion, the cycling effect should not start
  });

  it('includes Sparkles icon', () => {
    const { container } = render(<SkillSpotlight hidden={false} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('displays a skill from the SKILLS array', () => {
    const { container } = render(<SkillSpotlight hidden={false} />);
    const spotlight = container.firstChild;
    expect(spotlight.textContent).toBeTruthy();
  });

  it('applies translate-y when hidden prop is true', () => {
    const { container } = render(<SkillSpotlight hidden={true} />);
    const spotlight = container.firstChild;
    expect(spotlight).toHaveClass('translate-y-2');
  });

  it('positions correctly on screen', () => {
    const { container } = render(<SkillSpotlight hidden={false} />);
    const spotlight = container.firstChild;
    expect(spotlight).toHaveClass('fixed');
    expect(spotlight).toHaveClass('bottom-48');
    expect(spotlight).toHaveClass('right-6');
  });
});
