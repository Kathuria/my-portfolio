import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DetailPanel from './DetailPanel.jsx';

describe('DetailPanel', () => {
  it('renders nothing when nodeId is null', () => {
    const { container } = render(<DetailPanel nodeId={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for an unknown nodeId', () => {
    const { container } = render(<DetailPanel nodeId="not-a-real-node" onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the core Avi profile as a dialog', () => {
    render(<DetailPanel nodeId="avi" onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Avi Kathuria')).toBeInTheDocument();
  });

  it('renders a real node (Engineering) with its title and GitHub link', async () => {
    render(<DetailPanel nodeId="engineering" onClose={() => {}} />);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github profile/i })).toHaveAttribute(
      'href',
      'https://github.com/Kathuria'
    );
    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    render(<DetailPanel nodeId="engineering" onClose={onClose} />);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape', async () => {
    const onClose = vi.fn();
    render(<DetailPanel nodeId="engineering" onClose={onClose} />);
    // Let GitHubStatsCard's mocked fetch settle first so its state update
    // doesn't land after this test (and the render) finishes.
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows the Google Maps metric blocks with real numbers, not placeholder text', () => {
    render(<DetailPanel nodeId="google-maps" onClose={() => {}} />);
    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('52M+')).toBeInTheDocument();
  });
});
