import { Github, Linkedin, Mail, HelpCircle } from 'lucide-react';

export default function ContactDock({ onHelp }) {
  return (
    <>
      <div className="fixed left-3 top-3 z-30 flex items-center gap-2 sm:left-6 sm:top-6" title="Avi Kathuria">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold sm:h-12 sm:w-12 sm:text-base"
          style={{ background: '#C9A24B', color: '#241a06', fontFamily: "'Fraunces', serif" }}
        >
          AK
        </div>
      </div>

      <div className="fixed right-3 top-3 z-30 flex flex-wrap items-center justify-end gap-2 sm:right-6 sm:top-6 sm:gap-3">
        <a
          href="https://www.linkedin.com/in/avi-kathuria-6b222763/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="badge-star flex h-10 w-10 items-center justify-center rounded-full text-[#241a06] transition-transform hover:scale-110 active:scale-95"
        >
          <Linkedin size={18} strokeWidth={1.9} aria-hidden="true" />
        </a>
        <a
          href="https://github.com/Kathuria"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="badge-star flex h-10 w-10 items-center justify-center rounded-full text-[#241a06] transition-transform hover:scale-110 active:scale-95"
        >
          <Github size={18} strokeWidth={1.9} aria-hidden="true" />
        </a>
        <a
          href="mailto:avikathuria21@gmail.com"
          aria-label="Email"
          className="badge-star flex h-10 w-10 items-center justify-center rounded-full text-[#241a06] transition-transform hover:scale-110 active:scale-95"
        >
          <Mail size={18} strokeWidth={1.9} aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={onHelp}
          aria-label="How to explore"
          className="badge-star flex h-10 w-10 items-center justify-center rounded-full text-[#241a06] transition-transform hover:scale-110 active:scale-95"
        >
          <HelpCircle size={18} strokeWidth={1.9} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
