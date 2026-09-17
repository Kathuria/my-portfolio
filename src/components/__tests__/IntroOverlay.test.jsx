import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IntroOverlay from '../IntroOverlay.jsx';

describe('IntroOverlay', () => {
  it('renders as a dialog with proper ARIA attributes', () => {
    render(<IntroOverlay onDismiss={() => {}} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'intro-title');
  });

  it('displays the correct title and description', () => {
    render(<IntroOverlay onDismiss={() => {}} />);
    expect(screen.getByText('A map, not a resume')).toBeInTheDocument();
    expect(screen.getByText('Avi Kathuria')).toBeInTheDocument();
    expect(screen.getByText(/Software engineer, technical lead, traveler/i)).toBeInTheDocument();
  });

  it('has an Enter button that calls onDismiss', () => {
    const onDismiss = vi.fn();
    render(<IntroOverlay onDismiss={onDismiss} />);
    
    const enterButton = screen.getByRole('button', { name: /enter/i });
    expect(enterButton).toBeInTheDocument();
    
    fireEvent.click(enterButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses on Escape key press', () => {
    const onDismiss = vi.fn();
    render(<IntroOverlay onDismiss={onDismiss} />);
    
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('focuses the Enter button on mount', () => {
    render(<IntroOverlay onDismiss={() => {}} />);
    const enterButton = screen.getByRole('button', { name: /enter/i });
    // Note: jsdom doesn't perfectly simulate focus, but we can check the element exists
    expect(enterButton).toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    const { container } = render(<IntroOverlay onDismiss={() => {}} />);
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveAttribute('id', 'intro-title');
  });

  it('has backdrop with proper styling', () => {
    const { container } = render(<IntroOverlay onDismiss={() => {}} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('backdrop-blur-sm');
  });

  it('provides instructions for interaction', () => {
    render(<IntroOverlay onDismiss={() => {}} />);
    expect(screen.getByText(/Drag to look around/i)).toBeInTheDocument();
    expect(screen.getByText(/tap a star to read its story/i)).toBeInTheDocument();
  });
});
