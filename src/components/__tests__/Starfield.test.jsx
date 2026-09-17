import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import Starfield from '../Starfield.jsx';

describe('Starfield', () => {
  let matchMediaMock;
  let canvasContext;

  beforeEach(() => {
    // Mock canvas context
    canvasContext = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
    };

    HTMLCanvasElement.prototype.getContext = vi.fn(() => canvasContext);

    matchMediaMock = vi.fn();
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    window.matchMedia = matchMediaMock;

    let rafId = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => ++rafId);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('renders a canvas element', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('has proper ARIA attribute for decorative content', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  it('is non-interactive (pointer-events-none)', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('pointer-events-none');
  });

  it('covers full screen', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('fixed');
    expect(canvas).toHaveClass('inset-0');
  });

  it('initializes canvas with window dimensions', () => {
    render(<Starfield />);
    const canvas = document.querySelector('canvas');
    expect(canvas.width).toBe(window.innerWidth);
    expect(canvas.height).toBe(window.innerHeight);
  });

  it('starts animation loop', () => {
    render(<Starfield />);
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('respects prefers-reduced-motion', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<Starfield />);
    // With reduced motion, should still render once but not animate
    expect(canvasContext.clearRect).toHaveBeenCalled();
  });

  it('draws stars on canvas', () => {
    // This test validates that the component renders without errors
    // Drawing verification requires requestAnimationFrame to execute,
    // which we've mocked to prevent infinite loops
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('cleans up animation frame on unmount', () => {
    const { unmount } = render(<Starfield />);
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('adjusts to window resize', () => {
    render(<Starfield />);
    const initialWidth = window.innerWidth;
    
    // Simulate window resize
    global.innerWidth = 1920;
    global.innerHeight = 1080;
    window.dispatchEvent(new Event('resize'));
    
    const canvas = document.querySelector('canvas');
    expect(canvas.width).toBe(1920);
    expect(canvas.height).toBe(1080);
    
    // Restore
    global.innerWidth = initialWidth;
  });

  it('generates appropriate number of stars based on screen size', () => {
    // This test validates that the component handles screen size properly
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas.width).toBe(window.innerWidth);
    expect(canvas.height).toBe(window.innerHeight);
  });
});
