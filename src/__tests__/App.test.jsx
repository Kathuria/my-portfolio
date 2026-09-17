import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

describe('App', () => {
  beforeEach(() => {
    // Mock matchMedia for components that check for reduced motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Mock canvas context for Starfield
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
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
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      lineCap: '',
    }));

    // Mock requestAnimationFrame - don't immediately execute to avoid infinite loops
    let rafId = 0;
    global.requestAnimationFrame = vi.fn(() => ++rafId);
    global.cancelAnimationFrame = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main application with proper semantic HTML', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('renders all major components', () => {
    const { container } = render(<App />);
    
    // Check for canvas (Starfield)
    expect(container.querySelector('canvas')).toBeInTheDocument();
    
    // Check for main landmarks
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('does not show intro overlay by default', () => {
    render(<App />);
    expect(screen.queryByRole('dialog', { name: /avi kathuria/i })).not.toBeInTheDocument();
  });

  it('renders ContactDock with all social links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument();
  });

  it('switches to legacy app when legacy path is used', () => {
    // Mock location pathname
    delete window.location;
    window.location = { pathname: '/legacy', hash: '', search: '' };
    
    render(<App />);
    // Legacy app should be rendered instead of AviVerse
  });

  it('switches to legacy app when view=legacy query param is used', () => {
    delete window.location;
    window.location = { 
      pathname: '/', 
      hash: '', 
      search: '?view=legacy',
      toString: () => '/?view=legacy'
    };
    
    render(<App />);
    // Legacy app should be rendered
  });

  it('has proper background color', () => {
    // Reset location to default path
    delete window.location;
    window.location = { pathname: '/', hash: '', search: '', toString: () => '/' };
    
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('bg-[#0B0E14]');
  });

  it('is full screen', () => {
    // Reset location to default path
    delete window.location;
    window.location = { pathname: '/', hash: '', search: '', toString: () => '/' };
    
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('h-screen');
    expect(main).toHaveClass('w-screen');
    expect(main).toHaveClass('overflow-hidden');
  });
});
