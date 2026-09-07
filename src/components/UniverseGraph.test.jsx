import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UniverseGraph from './UniverseGraph.jsx';
import { NODES } from '../data/universe.js';

describe('UniverseGraph', () => {
  it('renders the core star and every node as a labeled, clickable button', () => {
    render(<UniverseGraph onSelect={() => {}} activeId={null} paused={false} />);
    expect(screen.getByRole('button', { name: /avi kathuria/i })).toBeInTheDocument();
    for (const n of NODES) {
      expect(screen.getByRole('button', { name: `${n.title} — open` })).toBeInTheDocument();
    }
  });

  it('becomes pointer-inert when paused', () => {
    const { container } = render(<UniverseGraph onSelect={() => {}} activeId={null} paused />);
    const stage = container.firstChild;
    expect(stage.className).toMatch(/pointer-events-none/);
  });
});
