import { Github, Linkedin, Mail, HelpCircle } from 'lucide-react';

export default function ContactDock({ onHelp }) {
  return (
    <>
      <div className="fixed left-6 top-6 z-30 flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
          style={{ background: '#C9A24B', color: '#241a06', fontFamily: "'Fraunces', serif" }}
        >
          AK
        </div>
        <span className="hidden text-sm text-[#B9B4A6] sm:inline">AviVerse</span>
      </div>

      <div className="fixed right-6 top-6 z-30 flex items-center gap-2.5">
        <a
          href="https://www.linkedin.com/in/avi-kathuria-6b222763/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="badge-star flex h-10 w-10 items-center justify-center rounded-full text-[#241a06] transition-transform hover:scale-110"
        >
          <Linkedin size={16} strokeWidth={1.9} aria-hidden="true" />
        </a>
        <a
          href="https://github.com/Kathuria"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="badge-star flex h-10 w-10 items-center justify-center rounded-full text-[#241a06] transition-transform hover:scale-110"
        >
          <Github size={16} strokeWidth={1.9} aria-hidden="true" />
        </a>
        <a
          href="mailto:avikathuria21@gmail.com"
          aria-label="Email"
          className="badge-star flex h-10 w-10 items-center justify-center rounded-full text-[#241a06] transition-transform hover:scale-110"
        >
          <Mail size={16} strokeWidth={1.9} aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={onHelp}
          aria-label="How to explore"
          className="badge-star flex h-10 w-10 items-center justify-center rounded-full text-[#241a06] transition-transform hover:scale-110"
        >
          <HelpCircle size={16} strokeWidth={1.9} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
