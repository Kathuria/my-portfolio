# AviVerse - Interactive Portfolio Experience

> A 3D universe-themed portfolio showcasing engineering projects, travel experiences, and contributions — built with React, Three.js, and creativity.

[![Live Site](https://img.shields.io/badge/Live-aviverse-5EC8C0?style=for-the-badge)](https://kathuria.github.io/my-portfolio/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite)](https://vite.dev)

## ✨ What is AviVerse?

An interactive 3D graph experience where each node represents a different aspect of my journey — from engineering projects and open-source contributions to travel photography and Google Maps reviews. Navigate through the universe by clicking nodes to reveal detailed panels with live data, embedded content, and curated stories.

## 🌟 Features

### Core Experience

- **3D Force Graph** - Interactive node-based navigation with physics simulation
- **Dynamic Panels** - Rich detail views with live GitHub stats, embedded content, and metrics
- **Starfield Background** - Animated shooting stars with node-targeted effects
- **Flight Memory** ✈️ - Premium 3D globe visualization of travel history with route animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Notable Nodes

- **Engineering** - Live GitHub stats and 10+ years of technical experience
- **Flight Memory** - Interactive 3D globe with 75+ flight routes across 33 airports
- **Google Maps** - Level 8 Local Guide with 52M+ photo views
- **Travel Atlas** - 21 U.S. states and 9 national parks documented
- **Projects** - Pokédex, Metals Catalog, Alexa Skills, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for flight data generation)

### Installation

```bash
# Clone the repository
git clone https://github.com/Kathuria/my-portfolio.git
cd my-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
```

### Flight Data Pipeline

The Flight Memory feature uses a privacy-first data pipeline:

```bash
# 1. Parse Excel file (private-data/flights.xlsx)
python3 scripts/parse-excel.py

# 2. Generate sanitized JSON
npx tsx scripts/generate-flights.ts
```

**⚠️ Important:** `flights.xlsx` contains sensitive data and must NEVER be committed. Only `flights.generated.json` is used by the frontend.

### Project Structure

```
my-portfolio/
├── src/
│   ├── components/          # React components
│   │   ├── UniverseGraph.jsx   # Main 3D graph
│   │   ├── DetailPanel.jsx     # Node detail drawer
│   │   ├── FlightMemory.jsx    # 3D globe (lazy loaded)
│   │   └── ...                 # Other components
│   ├── data/
│   │   ├── universe.js         # Node data and configuration
│   │   └── flights.generated.json  # Sanitized flight data
│   ├── App.jsx
│   └── main.jsx
├── scripts/
│   ├── parse-excel.py      # Excel to temp JSON
│   └── generate-flights.ts # JSON generator
├── public/
└── package.json
```

## 📊 Tech Stack

- **Framework:** React 19.2 with Hooks
- **Build Tool:** Vite 7.2 (Rolldown)
- **Styling:** Tailwind CSS 4.0
- **3D Graphics:** react-force-graph-2d, react-globe.gl
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library
- **Deployment:** GitHub Pages

## 🎨 Design Philosophy

- **Privacy First** - No sensitive personal data exposed
- **Performance** - Lazy loading, code splitting, optimized assets
- **Accessibility** - WCAG AAA contrast ratios, keyboard navigation
- **Mobile First** - Responsive design with intelligent node repositioning
- **Clean Code** - TypeScript strict mode, comprehensive tests

## 📝 Data Sources

All content is sourced from real data:

- GitHub API for live repository stats
- Google Maps profile (52M+ photo views)
- YouTube playlists and video metadata
- Personal travel logs and photography
- Published Alexa skills and open-source projects

Nothing is invented — this is a real portfolio backed by real work.

## 🚀 Deployment

Automatic deployment to GitHub Pages via GitHub Actions:

```yaml
# .github/workflows/deploy.yml
# Triggers on push to main branch
```

Live site: [kathuria.github.io/my-portfolio](https://kathuria.github.io/my-portfolio/)

## 📝 License

This is a personal portfolio project. Feel free to draw inspiration, but please create your own unique experience.

## 📧 Contact

- **Portfolio:** [kathuria.github.io](https://kathuria.github.io/)
- **GitHub:** [@Kathuria](https://github.com/Kathuria)
- **LinkedIn:** [Avi Kathuria](https://www.linkedin.com/in/avi-kathuria-6b222763/)

---

**Made with ♥️ by Avi Kathuria** | Dallas, TX
