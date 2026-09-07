import { describe, it, expect } from 'vitest';
import {
  CORE, NODES, EXTRA_EDGES, CLUSTER_META, SKILLS,
  YOUTUBE_PLAYLISTS, ALEXA_SKILLS, BASE_W, BASE_H, CORE_POS,
} from '../data/universe.js';

const VALID_CLUSTERS = new Set(Object.keys(CLUSTER_META));

describe('CORE', () => {
  it('has the fields the UI depends on', () => {
    expect(CORE.id).toBe('avi');
    expect(typeof CORE.title).toBe('string');
    expect(CORE.title.length).toBeGreaterThan(0);
    expect(typeof CORE.description).toBe('string');
  });
});

describe('NODES', () => {
  it('every node has the fields the graph and drawer require', () => {
    for (const n of NODES) {
      expect(n.id, `node missing id`).toBeTruthy();
      expect(typeof n.id).toBe('string');
      expect(VALID_CLUSTERS.has(n.cluster), `${n.id}: cluster "${n.cluster}" is not in CLUSTER_META`).toBe(true);
      expect(typeof n.x, `${n.id}: x should be a number`).toBe('number');
      expect(typeof n.y, `${n.id}: y should be a number`).toBe('number');
      expect(typeof n.r, `${n.id}: r should be a number`).toBe('number');
      expect(n.r, `${n.id}: r should be positive`).toBeGreaterThan(0);
      expect(typeof n.title, `${n.id}: title should be a string`).toBe('string');
      expect(n.title.length, `${n.id}: title should not be empty`).toBeGreaterThan(0);
      expect(typeof n.description, `${n.id}: description should be a string`).toBe('string');
    }
  });

  it('has no duplicate ids', () => {
    const ids = NODES.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no node id collides with the reserved "avi" core id', () => {
    expect(NODES.some((n) => n.id === 'avi')).toBe(false);
  });

  it('every node sits within the base canvas bounds (with its own radius)', () => {
    for (const n of NODES) {
      expect(n.x - n.r, `${n.id} left edge off-canvas`).toBeGreaterThanOrEqual(0);
      expect(n.x + n.r, `${n.id} right edge off-canvas`).toBeLessThanOrEqual(BASE_W);
      expect(n.y - n.r, `${n.id} top edge off-canvas`).toBeGreaterThanOrEqual(0);
      expect(n.y + n.r, `${n.id} bottom edge off-canvas`).toBeLessThanOrEqual(BASE_H);
    }
  });

  it('no two nodes visually overlap (circle-circle distance check)', () => {
    for (let i = 0; i < NODES.length; i += 1) {
      for (let j = i + 1; j < NODES.length; j += 1) {
        const a = NODES[i];
        const b = NODES[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const minDist = a.r + b.r;
        expect(dist, `${a.id} and ${b.id} overlap (dist ${dist.toFixed(0)} < ${minDist})`).toBeGreaterThanOrEqual(minDist);
      }
    }
  });

  it('no node overlaps the core star', () => {
    const CORE_R = 106; // half of the 212px core button
    for (const n of NODES) {
      const dist = Math.hypot(n.x - CORE_POS.x, n.y - CORE_POS.y);
      expect(dist, `${n.id} overlaps the core star`).toBeGreaterThanOrEqual(CORE_R + n.r);
    }
  });

  it('links, when present, are non-empty and well-formed', () => {
    for (const n of NODES) {
      if (!n.links) continue;
      expect(Array.isArray(n.links)).toBe(true);
      for (const l of n.links) {
        expect(typeof l.label, `${n.id}: link label`).toBe('string');
        expect(l.label.length).toBeGreaterThan(0);
        expect(l.url, `${n.id}: link url`).toMatch(/^https?:\/\//);
      }
    }
  });

  it('embedBlocked nodes never also try noPreview redundantly, and vice versa is fine', () => {
    // Not a hard rule, just documents intent: noPreview means "skip the
    // preview section entirely", embedBlocked means "show the creative
    // fallback instead of an iframe". A node can be embedBlocked without
    // noPreview, but flags should at least be booleans where present.
    for (const n of NODES) {
      if ('embedBlocked' in n) expect(typeof n.embedBlocked).toBe('boolean');
      if ('noPreview' in n) expect(typeof n.noPreview).toBe('boolean');
    }
  });
});

describe('EXTRA_EDGES', () => {
  it('every edge references two real, distinct node ids', () => {
    const ids = new Set(NODES.map((n) => n.id));
    for (const [a, b] of EXTRA_EDGES) {
      expect(ids.has(a), `edge references unknown node "${a}"`).toBe(true);
      expect(ids.has(b), `edge references unknown node "${b}"`).toBe(true);
      expect(a).not.toBe(b);
    }
  });

  it('has no exact duplicate edges', () => {
    const seen = new Set();
    for (const [a, b] of EXTRA_EDGES) {
      const key = [a, b].sort().join('|');
      expect(seen.has(key), `duplicate edge between ${a} and ${b}`).toBe(false);
      seen.add(key);
    }
  });
});

describe('CLUSTER_META', () => {
  it('every cluster used by a node has label, color, and textColor', () => {
    const usedClusters = new Set(NODES.map((n) => n.cluster));
    for (const cluster of usedClusters) {
      const meta = CLUSTER_META[cluster];
      expect(meta, `cluster "${cluster}" has no CLUSTER_META entry`).toBeTruthy();
      expect(meta.label).toBeTruthy();
      expect(meta.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(meta.textColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});

describe('SKILLS', () => {
  it('is a non-empty list of non-empty strings', () => {
    expect(Array.isArray(SKILLS)).toBe(true);
    expect(SKILLS.length).toBeGreaterThan(0);
    for (const s of SKILLS) {
      expect(typeof s).toBe('string');
      expect(s.length).toBeGreaterThan(0);
    }
  });
});

describe('YOUTUBE_PLAYLISTS', () => {
  it('every entry has a title and a playlist id', () => {
    for (const [title, playlistId] of YOUTUBE_PLAYLISTS) {
      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
      expect(typeof playlistId).toBe('string');
      expect(playlistId.length).toBeGreaterThan(0);
    }
  });
});

describe('ALEXA_SKILLS', () => {
  it('every entry has a title, an amazon url, and a logo url', () => {
    for (const [title, url, logo] of ALEXA_SKILLS) {
      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
      expect(url).toMatch(/^https:\/\/www\.amazon\.in\//);
      expect(logo).toMatch(/^https:\/\//);
    }
  });
});
