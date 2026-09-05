// All copy here is sourced from Avi's existing assets (site, portfolio, GitHub,
// travel channels, Google Maps profile). Nothing invented — this file is the
// single place to update if a stat or link changes.

export const CORE = {
  id: 'avi',
  title: 'Avi Kathuria',
  tagline: 'Software engineer. Technical lead. Traveler. Explorer. Photographer. Google Maps contributor. AI enthusiast.',
  description:
    "A decade spent building web products, and a parallel decade spent exploring the world — one repo, one road, and one photo at a time. This isn't a resume. It's a map. Pick a star.",
  image: 'https://cdn.gamma.app/y3nthswk60529mg/7a4e1fe73bac465cad782b9d1c807c34/original/IMG_8950.jpeg',
};

// cluster: 'build' | 'travel' | 'places'
export const NODES = [
  // ---------- BUILD ----------
  {
    id: 'pokedex',
    cluster: 'build',
    x: 365,
    y: 210,
    r: 24,
    title: 'Pokédex',
    tagline: 'An interactive Pokémon catalog with search and filters',
    description:
      'A playful, public project from Avi’s portfolio — an interactive catalog built around searching and exploring Pokémon data.',
    links: [{ label: 'Open Pokédex', url: 'https://kathuria.github.io/pokedex/' }],
  },
  {
    id: 'engineering',
    cluster: 'build',
    x: 800,
    y: 175,
    r: 30,
    title: 'Engineering + GitHub',
    tagline: '10+ years building web experiences in the open',
    description:
      'Technical Lead running full-stack development for enterprise platforms — performance optimization, mentoring engineering teams, and shipping resilient products at scale. GitHub is the running log of repositories, experiments, and contributions.',
    stats: ['10+ yrs experience', 'Technical Lead'],
    links: [{ label: 'GitHub profile', url: 'https://github.com/Kathuria' }],
  },
  {
    id: 'opensource',
    cluster: 'build',
    x: 1060,
    y: 250,
    r: 24,
    title: 'Open Source',
    tagline: 'Project write-ups & portfolio content',
    description:
      'A living archive of project breakdowns — the how and why behind the code, not just the commits.',
    links: [{ label: 'kathuria.github.io', url: 'https://kathuria.github.io/' }],
  },
  {
    id: 'metals-catalog',
    cluster: 'build',
    x: 390,
    y: 385,
    r: 26,
    title: 'Metals Catalog',
    tagline: 'Next.js · TypeScript · Tailwind · Supabase',
    description:
      'A personal side project — a searchable catalog of metals, built end-to-end as a real product rather than a tutorial clone.',
    links: [{ label: 'Open the catalog', url: 'https://metals-catalog.vercel.app/catalog' }],
  },
  {
    id: 'portfolio',
    cluster: 'build',
    x: 1325,
    y: 170,
    r: 25,
    title: 'Portfolio',
    tagline: 'Project stories, career highlights, and selected work',
    description:
      'A visual collection of Avi’s project summaries and professional highlights — the portfolio previously available from the legacy site, now part of the map.',
    links: [{ label: 'Open the visual portfolio', url: 'https://avikathuria-portfolio-ymlhrik.gamma.site/' }],
    embed: true,
  },

  // ---------- TRAVEL ----------
  {
    id: 'travel',
    cluster: 'travel',
    x: 320,
    y: 610,
    r: 30,
    title: 'Travel Atlas',
    tagline: 'Photographs and field notes from the road',
    description:
      'A visual record of 28+ U.S. states and nine national parks — separate from the YouTube travel channel and the long-form blog.',
    stats: ['28+ U.S. states covered', '9 national parks visited'],
    image: '/images/national-parks-panorama.png',
    parkGroups: [
      ['Washington', ['Mount Rainier National Park']],
      ['Colorado', ['Rocky Mountain National Park', 'Great Sand Dunes National Park & Preserve', 'Black Canyon of the Gunnison National Park']],
      ['Utah', ['Arches National Park', 'Bryce Canyon National Park', 'Canyonlands National Park']],
      ['Arizona', ['Grand Canyon National Park']],
      ['Tennessee / North Carolina', ['Great Smoky Mountains National Park']],
    ],
  },
  {
    id: 'astonishing-facts',
    cluster: 'share',
    x: 1360,
    y: 520,
    r: 24,
    title: 'Astonishing Facts',
    tagline: 'A separate Facebook community for the surprising and remarkable',
    description:
      'Avi’s Facebook page for astonishing facts is its own destination — separate from the travel archive and travel channel.',
    destinationNote: 'A public Facebook page for surprising, remarkable, and thought-provoking facts — separate from Avi’s travel work.',
    links: [{ label: 'Open Astonishing Facts on Facebook', url: 'https://www.facebook.com/AstonishingFactsYouReallyNeedToKnow?mibextid=wwXIfr&rdid=BneagBd5OPFHmKFP&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19DsruWEas%2F%3Fmibextid%3DwwXIfr#' }],
  },
  {
    id: 'youtube',
    cluster: 'travel',
    x: 145,
    y: 745,
    r: 25,
    title: 'YouTube',
    tagline: '@akuploader — travel & exploration channel',
    description:
      'Video documentation of trips and discoveries, kept as a running travel log rather than a highlight reel.',
    links: [{ label: 'Watch on YouTube', url: 'https://youtube.com/@akuploader?si=_OQyC9M_m0MBEpJu' }],
  },
  {
    id: 'blog',
    cluster: 'travel',
    x: 420,
    y: 800,
    r: 25,
    title: 'Blog',
    tagline: 'Tribute to India — a historic travel blog',
    description:
      'Years of long-form travel writing, chronicling journeys across India long before it was fashionable to blog about them.',
    links: [{ label: 'Read the blog', url: 'http://tribute-to-india.blogspot.com' }],
  },

  // ---------- PLACES ----------
  {
    id: 'google-maps',
    cluster: 'places',
    x: 1090,
    y: 610,
    r: 32,
    title: 'Google Maps',
    tagline: 'Level 8 Local Guide',
    description:
      'A quiet, years-long habit of reviewing, mapping, and photographing places — grown into one of the most active Local Guide profiles around.',
    stats: ['Level 8 Local Guide', '10,000+ contributions', '39,000+ points', '52,000,000+ photo views'],
    destinationNote: 'Avi Kathuria · Local Guide Level 8 · Explorer of new experiences :) Photography has earned 52,000,000+ photo views.',
    links: [
      {
        label: 'View Local Guide profile',
        url: 'https://www.google.com/maps/contrib/106987478734810935880/photos/@32.78761,-96.8091459,1001m/data=!3m2!1e3!4b1!4m3!8m2!3m1!1e1',
      },
      { label: 'Open featured Google review', url: 'https://maps.app.goo.gl/daxji7GnSyAFq2qw7?g_st=ia' },
    ],
  },
  {
    id: 'journey',
    cluster: 'travel',
    x: 960,
    y: 825,
    r: 30,
    title: 'Journey',
    tagline: 'A timeline of products, roads, and places explored',
    description:
      'The ongoing story spans software, leadership, travel, and the places documented along the way.',
    stats: ['28+ U.S. states covered', '9 national parks explored'],
    timeline: [
      ['2014', 'Software Trainee — Aricent'],
      ['2015–2018', 'Associate QA Engineer — Sapient Global Markets'],
      ['2019–2022', 'Senior Associate — Publicis Sapient'],
      ['2022–2026', 'Technical Lead — enterprise web platforms'],
      ['Along the way', '28+ U.S. states and 9 national parks explored'],
    ],
  },
];

// Public playlists captured from the channel's public Playlists page.
// Thumbnails are YouTube's own public video thumbnail URLs.
export const YOUTUBE_PLAYLISTS = [
  ['The Franklin Institute', 'PLE0T6MvWABcx5W7eCcEcNbGhgT4ky2Acg', 'CkJ1gKILIoU'],
  ['Philadelphia', 'PLE0T6MvWABcxL1ShY5g4XINilCv-NV34S', '6k28r93eeSM'],
  ['Miami', 'PLE0T6MvWABcxHfifrMb1htmg5pIkWQu3V', '7sxfCDyEktE'],
  ['New York', 'PLE0T6MvWABczmiVGByvP8N6eevX831aI-', 'O3h5kRtv6z4'],
  ['Orlando', 'PLE0T6MvWABczpGFEtnAHCLYeMUKrUe9LI', 'f2cVpkhyzvE'],
  ['Boston', 'PLE0T6MvWABcwY5jCUF2ozy42CEoEAuB92', 'q61dzjhUesA'],
  ['Seattle', 'PLE0T6MvWABcxiCseKnAXkiw9m9Rdjw1fj', 'opsBvfcPkiM'],
  ['Chandigarh', 'PLE0T6MvWABcweo_ABxTIT79_ILj437z-W', 'MmvzTH9Lxnk'],
  ['Los Angles', 'PLE0T6MvWABcyZUEyYGC253QVWu_xM3rI_', 'Fxy8Y9fU_1U'],
  ['Indiana', 'PLE0T6MvWABcx43Md4zWyhq6ps3a0nC7H9', 'oojHvT8FQnY'],
  ['San Francisco', 'PLE0T6MvWABcwu-ZuCNsqCMZofEQylTEuQ', '-lkb9x7PfUI'],
  ['Nashville', 'PLE0T6MvWABcwimvszxVoxVky7u1QKVXnp', '5rUMbYYpwfk'],
  ['Movie Glimpses', 'PLE0T6MvWABcxjxXzxNXzs8jETlNY66X1_', 'mQx5kqkPlk0'],
  ['Baltimore', 'PLE0T6MvWABcwo6wbJEAM6_5qbIXUuDqel', 'o3W02gymk1A'],
  ['Washington DC', 'PLE0T6MvWABczVLB4uHJcZRgemW1X-N4K4', 'djhX8EOrLNo'],
  ['Stone Mountain', 'PLE0T6MvWABcyqATgzYEfOqGplm6q0FAze', '53ZQoKhbPtQ'],
  ['World of Coca Cola', 'PLE0T6MvWABcyH5e0Tc0hyewGwlm2OnFyh', null],
  ['AAPI Family Weekend 2025', 'PLE0T6MvWABcxlQdihZf-N-Mhlol1O1gtr', 'MyvdGub4Hfw'],
  ['Atlanta', 'PLE0T6MvWABcxXJcIp7JAmXhuAMrpZORgx', '53ZQoKhbPtQ'],
  ['Chicago Fed Museum', 'PLE0T6MvWABcwDg2xbrFf9GtbbaUd7MfnN', null],
  ['Chicago', 'PLE0T6MvWABczEbmYqyz5pvc1la4WmNtO6', 'KhC1MgQDD6U'],
  ['Festival of Joy', 'PLE0T6MvWABcw7muWL26y9Hg8qemYd1hp6', 'vo4s1IKASw0'],
  ['Shedd Aquarium', 'PLE0T6MvWABczwTYejklWRXKgXJ8tMGuRQ', 'dj5oDJNWufw'],
  ['Concert', 'PLE0T6MvWABcxF-NmDD33VzHZkpwocQ9-m', 'frkxA2fNn10'],
  ['Mountains 🏔️', 'PLE0T6MvWABcw17XdxqyIVzEdCSAUW3kwK', 'qkTmvYD_WWE'],
  ['Flight ✈️', 'PLE0T6MvWABcxB0Upx-8UoSnwimxUMCQzv', 'MJzIvUkvGBw'],
  ['Glimpses', 'PLE0T6MvWABczRB-JANFzDGx6JveL8ENQW', 'O3h5kRtv6z4'],
  ['Weather', 'PLE0T6MvWABcxqVFEZIjz9ZGL2cCr1Uome', 'D1fsHQQy0WM'],
  ['San Diego', 'PLE0T6MvWABczGavA1Fjh48H3A66KKvIGI', null],
  ['San Diego Zoo', 'PLE0T6MvWABcwJ24RWUnhbEP2wBv6WXwEX', null],
];

// Extra connections beyond the automatic core -> node spoke, drawn as
// thinner secondary lines to show how the constellations relate to each other.
export const EXTRA_EDGES = [
  ['engineering', 'opensource'],
  ['engineering', 'metals-catalog'],
  ['engineering', 'portfolio'],
  ['engineering', 'pokedex'],
  ['travel', 'youtube'],
  ['travel', 'blog'],
  ['journey', 'travel'],
  ['journey', 'engineering'],
];

export const CLUSTER_META = {
  build: { label: 'Build', color: '#5EC8C0' },
  travel: { label: 'Travel', color: '#E08D3C' },
  places: { label: 'Places', color: '#8FB37E' },
  share: { label: 'Share', color: '#B18CD2' },
};

export const BASE_W = 1600;
export const BASE_H = 1000;
export const CORE_POS = { x: 800, y: 500 };
