import { useEffect, useRef, useState } from 'react';

export default function PSFinalCommit() {
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Set page title and ensure favicon is loaded
    document.title = '10.10.10 - PS Final Commit | Avi Kathuria';
    
    // Ensure favicon link exists
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/png';
      favicon.href = '/ak.png';
      document.head.appendChild(favicon);
    }
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }
    );

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => observerRef.current?.observe(section));

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        events: {
          'onReady': (event) => {
            event.target.setVolume(20); // Set volume to 20%
            event.target.unMute(); // Ensure sound is on
          }
        }
      });
    };

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0E14] text-gray-900 dark:text-[#F2EFE6] transition-colors duration-300">
      {/* Easter Egg Navigation */}
      <a
        href="/"
        className="fixed top-6 right-6 z-50 group flex items-center gap-2 px-4 py-2 bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-gray-300/20 dark:border-white/10 rounded-full text-xs font-medium opacity-30 hover:opacity-100 transition-all duration-300 hover:scale-105"
        aria-label="Return to main website"
      >
        <span className="hidden sm:inline opacity-60 group-hover:opacity-100 transition-opacity">Know more about Avi</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </a>

      {/* Hero Section - Massive 10.10.10 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20 dark:from-[#0B0E14] dark:via-[#12161F] dark:to-[#0B0E14]" />
        
        {/* Animated grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] animate-grain" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-7xl mx-auto flex flex-col items-center justify-center">
          {/* Sapient Logo - 200px above 10.10.10 */}
          <div className="mb-[200px] animate-fade-in-up" style={{ animationDelay: '0s' }}>
            <img 
              src="/sapient-logo.gif" 
              alt="Sapient" 
              className="h-12 md:h-16 lg:h-20 w-auto opacity-80 dark:opacity-70"
              loading="eager"
            />
          </div>

          {/* Massive Numbers */}
          <div className="hero-numbers-container">
            <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20">
              <div className="hero-number-group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="hero-massive-number">10</div>
                <div className="hero-label">Years</div>
              </div>
              <div className="hero-dot" style={{ animationDelay: '0.4s' }}>·</div>
              <div className="hero-number-group animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="hero-massive-number">10</div>
                <div className="hero-label">Months</div>
              </div>
              <div className="hero-dot" style={{ animationDelay: '0.8s' }}>·</div>
              <div className="hero-number-group animate-fade-in-up" style={{ animationDelay: '1s' }}>
                <div className="hero-massive-number">10</div>
                <div className="hero-label">Days</div>
              </div>
            </div>
          </div>

          {/* Tagline + Scroll Arrow - 100px below 10.10.10 */}
          <div className="mt-[100px] flex flex-col items-center gap-6 text-center">
            {/* Subtitle */}
            <p className="hero-subtitle animate-fade-in-up px-4" style={{ animationDelay: '1.2s' }}>
              A Journey of Innovation, Growth, and Impact
            </p>

            {/* Scroll indicator */}
            <div className="animate-bounce-slow" style={{ animationDelay: '1.6s' }}>
              <div className="flex flex-col items-center gap-2 opacity-30 dark:opacity-25 hover:opacity-70 dark:hover:opacity-60 transition-opacity duration-300">
                <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Summary Section */}
      <section
        id="journey-summary"
        className="animate-on-scroll min-h-screen flex items-center py-24 px-6 relative"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className={`transition-all duration-1000 ${isVisible['journey-summary'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="section-title mb-20 text-center md:text-left">The Journey</h2>
            
            {/* Timeline */}
            <div className="space-y-16 relative">
              {/* Vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent hidden md:block" style={{ left: '3.5rem' }} />
              
              {/* Company Evolution */}
              <div className="timeline-item" style={{ animationDelay: '0.1s' }}>
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <div className="timeline-label">Company</div>
                  <div className="w-full flex flex-col md:flex-row justify-center md:justify-start items-center gap-2 md:gap-6 text-center md:text-left font-light" style={{ fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif', fontSize: 'clamp(1.25rem, 3vw, 2rem)', letterSpacing: '-0.01em' }}>
                    <span>Sapient Global Markets</span>
                    <span className="opacity-30 text-2xl md:rotate-0 rotate-90">→</span>
                    <span>Publicis Sapient</span>
                  </div>
                </div>
              </div>

              {/* Location Progression */}
              <div className="timeline-item" style={{ animationDelay: '0.2s' }}>
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <div className="timeline-label">Locations</div>
                  <div className="w-full flex flex-col md:flex-row justify-center md:justify-start items-center gap-2 md:gap-6 text-center md:text-left font-light" style={{ fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif', fontSize: 'clamp(1.25rem, 3vw, 2rem)', letterSpacing: '-0.01em' }}>
                    <span>Gurugram</span>
                    <span className="opacity-30 text-2xl md:rotate-0 rotate-90">→</span>
                    <span>Noida</span>
                    <span className="opacity-30 text-2xl md:rotate-0 rotate-90">→</span>
                    <span>Dallas</span>
                  </div>
                </div>
              </div>

              {/* Role Evolution */}
              <div className="timeline-item" style={{ animationDelay: '0.3s' }}>
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <div className="timeline-label">Role Evolution</div>
                  <div className="timeline-value-roles">
                    <div className="timeline-role">Junior Associate QA</div>
                    <div className="timeline-arrow-role">↓</div>
                    <div className="timeline-role">Associate QA</div>
                    <div className="timeline-arrow-role">↓</div>
                    <div className="timeline-role">Associate QA L2</div>
                    <div className="timeline-arrow-role">↓</div>
                    <div className="timeline-role">Associate Experience Technology Level 2</div>
                    <div className="timeline-arrow-role">↓</div>
                    <div className="timeline-role">Senior Associate Experience Technology</div>
                    <div className="timeline-arrow-role">↓</div>
                    <div className="timeline-role timeline-role-final">Lead Experience Engineer</div>
                  </div>
                </div>
              </div>

              {/* Career Path */}
              <div className="timeline-item" style={{ animationDelay: '0.4s' }}>
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <div className="timeline-label">Career Path</div>
                  <div className="w-full flex flex-col md:flex-row justify-center md:justify-start items-center gap-2 md:gap-6 text-center md:text-left font-light" style={{ fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif', fontSize: 'clamp(1.25rem, 3vw, 2rem)', letterSpacing: '-0.01em' }}>
                    <span>QA</span>
                    <span className="opacity-30 text-2xl md:rotate-0 rotate-90">→</span>
                    <span>Development</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Evolution GIF Section */}
      <section
        id="career-evolution"
        className="animate-on-scroll min-h-screen flex items-center py-24 px-6 relative bg-gray-50/50 dark:bg-[#0D1117]"
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className={`transition-all duration-1000 delay-200 ${isVisible['career-evolution'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="section-title mb-12 text-center">Signature Evolution</h2>
            <p className="text-center text-lg opacity-60 mb-16 max-w-2xl mx-auto">
              Every signature tells a story—watch how mine transformed through the years
            </p>
            
            {/* GIF Container with premium styling */}
            <div className="gif-container group">
              <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#12161F] shadow-2xl shadow-black/10 dark:shadow-black/50 transition-all duration-500 group-hover:shadow-3xl group-hover:scale-[1.02]">
                {/* Image */}
                <img
                  src="/Avi_Career_Journey_Transparent.gif"
                  alt="Career signature evolution from 2014 to 2025"
                  className="w-full h-auto"
                  loading="lazy"
                />
                
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Caption */}
              <p className="text-center mt-8 text-sm opacity-50 italic">
                From first day to final commit—a visual journey through 10 years, 10 months, and 10 days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Glimpse Video Section */}
      <section
        id="journey-glimpse"
        className="animate-on-scroll min-h-screen flex items-center py-24 px-6 relative"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className={`transition-all duration-1000 delay-300 ${isVisible['journey-glimpse'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h2 className="section-title mb-12 text-center">Journey Glimpse</h2>
            
            {/* YouTube Shorts Video - Vertical */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Video Container - Vertical aspect ratio for Shorts */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/50 bg-black" style={{ aspectRatio: '9/16' }}>
                  {/* YouTube Shorts Embed */}
                  <iframe
                    id="youtube-player"
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/4hDOyYEJ9-Q?autoplay=0&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
                    title="Journey Glimpse - 10 Years, 10 Months, 10 Days"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Caption */}
                <p className="text-center mt-8 text-sm opacity-50 italic">
                  A cinematic glimpse through 10 years, 10 months, and 10 days of "Journey"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-gray-200 dark:border-white/5">
        <p className="text-sm opacity-40 tracking-wide">
          With gratitude for the journey and excitement for what's ahead
        </p>
      </footer>

      {/* CSS for animations and styling */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-grain {
          animation: grain 8s steps(10) infinite;
        }

        /* Hero styles */
        .hero-massive-number {
          font-size: clamp(5rem, 18vw, 16rem);
          font-weight: 200;
          line-height: 0.9;
          letter-spacing: -0.04em;
          font-feature-settings: 'tnum' on, 'lnum' on;
          background: linear-gradient(135deg, #C9A24B 0%, #F4E7C1 50%, #8a6c2c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dark .hero-massive-number {
          background: linear-gradient(135deg, #FFD700 0%, #F4E7C1 50%, #C9A24B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-label {
          font-family: 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
          font-size: clamp(0.75rem, 1.5vw, 1rem);
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.5;
          margin-top: clamp(0.5rem, 1vw, 1rem);
        }

        .hero-dot {
          font-size: clamp(3rem, 10vw, 8rem);
          opacity: 0.2;
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          font-weight: 400;
          opacity: 0.6;
          letter-spacing: 0.02em;
          margin-top: clamp(2rem, 4vw, 4rem);
        }

        /* Section title */
        .section-title {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          opacity: 0.9;
        }

        /* Timeline styles */
        .timeline-item {
          position: relative;
          padding-left: 0;
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
          text-align: center;
        }

        @media (min-width: 768px) {
          .timeline-item {
            padding-left: 6rem;
            text-align: left;
          }
        }

        .timeline-marker {
          position: absolute;
          left: 3.25rem;
          top: 0.5rem;
          width: 0.5rem;
          height: 0.5rem;
          background: linear-gradient(135deg, #C9A24B, #FFD700);
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(201, 162, 75, 0.1);
          display: none;
        }

        @media (min-width: 768px) {
          .timeline-marker {
            display: block;
          }
        }

        .timeline-label {
          font-family: 'JetBrains Mono', 'IBM Plex Mono', 'Courier New', monospace;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.5;
          margin-bottom: 0.75rem;
        }

        .timeline-value {
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: clamp(1.25rem, 3vw, 2rem);
          font-weight: 300;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: clamp(0.75rem, 2vw, 1.5rem);
          justify-content: center;
          text-align: center;
        }

        @media (min-width: 768px) {
          .timeline-value {
            justify-content: flex-start;
            text-align: left;
          }
        }

        .timeline-value span {
          text-align: center;
          display: inline-block;
        }

        @media (min-width: 768px) {
          .timeline-value span {
            text-align: left;
          }
        }

        .timeline-content {
          width: 100%;
        }

        .timeline-arrow {
          opacity: 0.3;
          font-size: 1.5rem;
        }

        .timeline-value-roles {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        @media (min-width: 768px) {
          .timeline-value-roles {
            align-items: flex-start;
          }
        }

        .timeline-arrow-role {
          opacity: 0.3;
          font-size: 1.5rem;
        }

        @media (min-width: 768px) {
          .timeline-arrow-role {
            margin-left: 2rem;
          }
        }

        .timeline-role {
          font-size: clamp(0.875rem, 2vw, 1.125rem);
          opacity: 1;
          font-weight: 300;
          text-align: center;
        }

        @media (min-width: 768px) {
          .timeline-role {
            text-align: left;
          }
        }

        .timeline-role-final {
          font-size: clamp(1rem, 2.2vw, 1.25rem);
          opacity: 1;
          font-weight: 400;
        }

        /* GIF container */
        .gif-container {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .hero-massive-number {
            font-size: clamp(4rem, 20vw, 6rem);
          }
          
          .timeline-value {
            font-size: 1.25rem;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .timeline-arrow {
            transform: rotate(90deg);
            font-size: 1.25rem;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          
          .animate-fade-in-up,
          .animate-bounce-slow,
          .animate-grain,
          .timeline-item {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
