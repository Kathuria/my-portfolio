import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactDock from '../ContactDock.jsx';

describe('ContactDock', () => {
  it('renders the user initials badge', () => {
    render(<ContactDock onHelp={() => {}} />);
    expect(screen.getByText('AK')).toBeInTheDocument();
  });

  it('renders all social media links with correct URLs', () => {
    render(<ContactDock onHelp={() => {}} />);
    
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/avi-kathuria-6b222763/');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');

    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/Kathuria');
    expect(githubLink).toHaveAttribute('target', '_blank');

    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:avikathuria21@gmail.com');
  });

  it('renders help button and triggers onHelp callback', () => {
    const onHelp = vi.fn();
    render(<ContactDock onHelp={onHelp} />);
    
    const helpButton = screen.getByRole('button', { name: /how to explore/i });
    expect(helpButton).toBeInTheDocument();
    
    fireEvent.click(helpButton);
    expect(onHelp).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility labels on all interactive elements', () => {
    render(<ContactDock onHelp={() => {}} />);
    
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How to explore' })).toBeInTheDocument();
  });

  it('applies badge-star styling to all buttons', () => {
    const { container } = render(<ContactDock onHelp={() => {}} />);
    const badges = container.querySelectorAll('.badge-star');
    expect(badges.length).toBe(4); // LinkedIn, GitHub, Email, Help
  });

  it('has aria-hidden on decorative icons', () => {
    const { container } = render(<ContactDock onHelp={() => {}} />);
    const icons = container.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('meets minimum touch target size for mobile', () => {
    const { container } = render(<ContactDock onHelp={() => {}} />);
    const buttons = container.querySelectorAll('a, button');
    buttons.forEach((button) => {
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('w-10');
    });
  });
});
