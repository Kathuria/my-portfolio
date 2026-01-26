import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, Code, Briefcase, FolderGit2, User, Sparkles, Rocket, Zap, Terminal } from 'lucide-react';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState(null);
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  const sections = [
    {
      id: 'about',
      title: 'About Me',
      subtitle: 'Senior Frontend Developer',
      icon: User,
      gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="g1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(139,92,246);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(217,70,239);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g1)" width="400" height="400"/%3E%3Ccircle cx="200" cy="150" r="60" fill="white" opacity="0.2"/%3E%3Crect x="140" y="220" width="120" height="140" rx="10" fill="white" opacity="0.2"/%3E%3C/svg%3E'
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      subtitle: 'Featured Work',
      icon: Briefcase,
      gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="g2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(6,182,212);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(67,56,202);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g2)" width="400" height="400"/%3E%3Crect x="80" y="120" width="240" height="160" rx="10" fill="white" opacity="0.2"/%3E%3Ccircle cx="140" cy="180" r="20" fill="white" opacity="0.3"/%3E%3Crect x="180" y="170" width="100" height="8" rx="4" fill="white" opacity="0.3"/%3E%3Crect x="180" y="190" width="120" height="8" rx="4" fill="white" opacity="0.3"/%3E%3C/svg%3E'
    },
    {
      id: 'techstack',
      title: 'Tech Stack',
      subtitle: 'Skills & Tools',
      icon: Code,
      gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="g3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(16,185,129);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(6,182,212);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g3)" width="400" height="400"/%3E%3Cpath d="M150 180 L180 150 L180 210 Z" fill="white" opacity="0.2"/%3E%3Cpath d="M250 180 L220 150 L220 210 Z" fill="white" opacity="0.2"/%3E%3Crect x="140" y="230" width="120" height="12" rx="6" fill="white" opacity="0.2"/%3E%3Crect x="140" y="250" width="100" height="12" rx="6" fill="white" opacity="0.2"/%3E%3C/svg%3E'
    },
    {
      id: 'projects',
      title: 'Projects',
      subtitle: 'Live Demos',
      icon: Rocket,
      gradient: 'from-orange-500 via-red-600 to-pink-700',
      image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="g4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(249,115,22);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(219,39,119);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g4)" width="400" height="400"/%3E%3Cpath d="M200 100 L220 160 L280 160 L230 200 L250 260 L200 220 L150 260 L170 200 L120 160 L180 160 Z" fill="white" opacity="0.2"/%3E%3C/svg%3E'
    },
  ];

  const projects = [
    { name: 'Pokedex', url: 'https://kathuria.github.io/pokedex/', desc: 'Interactive Pokemon catalog with search & filters', tech: 'React, API Integration' },
    { name: 'Metals Catalog', url: 'https://metals-catalog.vercel.app/', desc: 'Comprehensive metals information platform', tech: 'Next.js, Vercel' },
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'about':
        return (
          <div className="min-h-screen overflow-auto bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
            <div className="max-w-6xl mx-auto px-6 py-20">
              <div className="mb-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full shadow-lg mb-6">
                  <Sparkles className="text-violet-600" size={20} />
                  <span className="text-violet-600 font-semibold">Available for opportunities</span>
                </div>
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Avi Kathuria
                </h1>
                <p className="text-3xl text-gray-700 mb-4">Technical Lead & React Specialist</p>
                <p className="text-xl text-gray-600">Chandigarh, India • 10+ Years Experience</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                      <Briefcase className="text-white" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Current Role</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-violet-600">Publicis Sapient</strong> - Leading full-stack development for enterprise 
                    investment banking platforms serving thousands of users with 99.9% uptime. Reduced page load times by 40% 
                    and mentor 15+ developers.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <Zap className="text-white" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Impact</h2>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-violet-600"></div>
                      <span className="text-gray-700">40% faster page loads</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span className="text-gray-700">80%+ code coverage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-fuchsia-600"></div>
                      <span className="text-gray-700">60% faster deployments</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Core Expertise</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['React', 'TypeScript', 'Node.js', 'Next.js', 'AWS', 'GraphQL', 'Microservices', 'CI/CD'].map((skill, idx) => (
                    <div key={idx} className="px-4 py-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl text-center font-semibold text-violet-700 hover:scale-105 transition-transform">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="mailto:avikathuria21@gmail.com" 
                   className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                  <Mail size={20} />
                  Get in Touch
                </a>
                <a href="https://www.linkedin.com/in/avi-kathuria-6b222763/" target="_blank" rel="noopener noreferrer"
                   className="px-8 py-4 bg-white/80 backdrop-blur-xl text-gray-800 rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 border border-gray-200">
                  <Linkedin size={20} />
                  LinkedIn
                </a>
                <a href="https://github.com/Kathuria" target="_blank" rel="noopener noreferrer"
                   className="px-8 py-4 bg-white/80 backdrop-blur-xl text-gray-800 rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 border border-gray-200">
                  <Github size={20} />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Portfolio Showcase
              </h1>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20" style={{height: 'calc(100vh - 200px)'}}>
                <iframe 
                  src="https://avikathuria-portfolio-ymlhrik.gamma.site/" 
                  className="w-full h-full"
                  title="Portfolio"
                />
              </div>
              <a href="https://avikathuria-portfolio-ymlhrik.gamma.site/" target="_blank" rel="noopener noreferrer"
                 className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all">
                <ExternalLink size={20} />
                Open Full Portfolio
              </a>
            </div>
          </div>
        );

      case 'techstack':
        return (
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Tech Stack & Skills
              </h1>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20" style={{height: 'calc(100vh - 200px)'}}>
                <iframe 
                  src="https://kathuria.github.io/" 
                  className="w-full h-full"
                  title="Tech Stack"
                />
              </div>
              <a href="https://kathuria.github.io/" target="_blank" rel="noopener noreferrer"
                 className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all">
                <ExternalLink size={20} />
                Explore Full Stack
              </a>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="min-h-screen overflow-auto bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-6">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Featured Projects
              </h1>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {projects.map((project, idx) => (
                  <div key={idx} className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl hover:-translate-y-2 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Rocket className="text-white" size={32} />
                      </div>
                      <Terminal className="text-orange-600 opacity-20 group-hover:opacity-100 transition-opacity" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h2>
                    <p className="text-gray-600 mb-3">{project.desc}</p>
                    <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold mb-4">
                      {project.tech}
                    </div>
                    <a href={project.url} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                      <ExternalLink size={18} />
                      View Live Demo
                    </a>
                  </div>
                ))}
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">More Projects on GitHub</h2>
                <p className="text-gray-600 mb-6">
                  Explore my complete portfolio of enterprise applications, open-source contributions, and experimental projects.
                </p>
                <a href="https://kathuria.github.io/" target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                  <Github size={20} />
                  View All Projects
                </a>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (activeSection) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <button
          onClick={() => setActiveSection(null)}
          className="fixed top-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gray-900/90 backdrop-blur-xl text-white flex items-center justify-center hover:bg-gray-900 transition-all shadow-2xl hover:scale-110"
        >
          <X size={24} />
        </button>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-950/50 backdrop-blur-2xl border-b border-white/10">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-lg">
              AK
            </div>
            <div>
              <div className="text-xl font-bold">Avi Kathuria</div>
              <div className="text-xs text-gray-400">Technical Lead</div>
            </div>
          </div>
          <div className="flex gap-3">
            <a href="https://www.linkedin.com/in/avi-kathuria-6b222763/" target="_blank" rel="noopener noreferrer"
               className="w-11 h-11 rounded-xl bg-blue-600/20 backdrop-blur-xl border border-blue-500/30 flex items-center justify-center hover:bg-blue-600/30 transition-all hover:scale-110">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com/Kathuria" target="_blank" rel="noopener noreferrer"
               className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110">
              <Github size={20} />
            </a>
            <a href="mailto:avikathuria21@gmail.com"
               className="w-11 h-11 rounded-xl bg-violet-600/20 backdrop-blur-xl border border-violet-500/30 flex items-center justify-center hover:bg-violet-600/30 transition-all hover:scale-110">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8">
            <Sparkles size={16} className="text-violet-400" />
            <span className="text-sm">10+ Years Building Digital Experiences</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Crafting Tomorrow's
            </span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Web Experiences
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Technical Lead specializing in React, TypeScript, and scalable enterprise solutions. 
            Currently transforming investment banking platforms at Publicis Sapient.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveSection('about')}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all"
            >
              Explore My Journey
            </button>
            <a href="mailto:avikathuria21@gmail.com"
               className="px-8 py-4 bg-white/10 backdrop-blur-xl rounded-2xl font-semibold border border-white/20 hover:bg-white/20 hover:scale-105 transition-all">
              Let's Connect
            </a>
          </div>
        </div>
      </section>

      <section className="relative px-6 pb-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/30 transition-all hover:scale-105 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                    <img src={section.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-80 group-hover:opacity-90 transition-opacity`}></div>
                  
                  <div className="relative p-8 h-64 flex flex-col items-center justify-center text-center">
                    <Icon size={64} className="text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                    <h3 className="text-3xl font-bold text-white mb-2">{section.title}</h3>
                    <p className="text-white/90 text-base">{section.subtitle}</p>
                    
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={20} className="text-white" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Avi Kathuria • Built with React & Passion • Based in Chandigarh, India
          </p>
        </div>
      </footer>
    </div>
  );
}