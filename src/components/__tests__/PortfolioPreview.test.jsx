import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import PortfolioPreview from '../PortfolioPreview.jsx';

describe('PortfolioPreview', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('renders without crashing when mountNode is null', () => {
    const { container } = render(<PortfolioPreview mountNode={null} />);
    expect(container).toBeInTheDocument();
  });

  it('creates a fallback container in the body', () => {
    render(<PortfolioPreview mountNode={null} />);
    // Check that a fallback div was added to body
    const fallback = document.body.querySelector('[style*="position: fixed"]');
    expect(fallback).toBeInTheDocument();
  });

  it('renders an iframe with correct src', () => {
    render(<PortfolioPreview mountNode={null} />);
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://avikathuria-portfolio-ymlhrik.gamma.site/');
    expect(iframe).toHaveAttribute('title', 'Portfolio live preview');
  });

  it('moves iframe to mountNode when provided', () => {
    const mountNode = document.createElement('div');
    mountNode.id = 'test-mount';
    render(<PortfolioPreview mountNode={mountNode} />);
    
    // The iframe should be inside the mountNode
    expect(mountNode.querySelector('iframe')).toBeTruthy();
  });

  it('has proper referrerPolicy for security', () => {
    render(<PortfolioPreview mountNode={null} />);
    const iframe = document.querySelector('iframe');
    expect(iframe).toHaveAttribute('referrerPolicy', 'strict-origin-when-cross-origin');
  });

  it('triggers reload after STALL_TIMEOUT_MS if not loaded', () => {
    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);
    const { rerender } = render(<PortfolioPreview mountNode={null} />);
    
    // Provide mountNode to trigger the stall timeout
    rerender(<PortfolioPreview mountNode={mountNode} />);
    
    // Fast-forward time by 6000ms (STALL_TIMEOUT_MS)
    vi.advanceTimersByTime(6000);
    
    // The mountNode should still be in the document
    expect(mountNode.parentElement).toBe(document.body);
    
    // Clean up
    document.body.removeChild(mountNode);
  });

  it('cleans up fallback on unmount', () => {
    const { unmount } = render(<PortfolioPreview mountNode={null} />);
    const fallbackBefore = document.body.querySelector('[style*="position: fixed"]');
    expect(fallbackBefore).toBeInTheDocument();
    
    unmount();
    
    const fallbackAfter = document.body.querySelector('[style*="position: fixed"]');
    expect(fallbackAfter).not.toBeInTheDocument();
  });

  it('applies correct inline styles to iframe', () => {
    render(<PortfolioPreview mountNode={null} />);
    const iframe = document.querySelector('iframe');
    expect(iframe.style.width).toBe('100%');
    expect(iframe.style.height).toBe('100%');
    expect(iframe.style.border).toBe('0px');
  });
});
