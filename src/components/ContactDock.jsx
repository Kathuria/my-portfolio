import { Github, Linkedin, Mail, HelpCircle } from 'lucide-react';

export default function ContactDock({ onHelp }) {
  return (
    <>
      <div className="fixed left-6 top-6 z-30 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
          style={{ background: '#C9A24B', color: '#241a06', fontFamily: "'Fraunces', serif" }}
        >
          AK
        </div>
        <span className="hidden text-sm text-[#B9B4A6] sm:inline">AviVerse</span>
      </div>

      <div className="fixed right-6 top-6 z-30 flex items-center gap-2">
        <a
          href="https://www.linkedin.com/in/avi-kathuria-6b222763/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A24B]/30 bg-[#0B0E14]/70 text-[#EDE6D6] backdrop-blur hover:border-[#C9A24B]"
        >
          <Linkedin size={17} />
        </a>
        <a
          href="https://github.com/Kathuria"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A24B]/30 bg-[#0B0E14]/70 text-[#EDE6D6] backdrop-blur hover:border-[#C9A24B]"
        >
          <Github size={17} />
        </a>
        <a
          href="mailto:avikathuria21@gmail.com"
          aria-label="Email"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A24B]/30 bg-[#0B0E14]/70 text-[#EDE6D6] backdrop-blur hover:border-[#C9A24B]"
        >
          <Mail size={17} />
        </a>
        <button
          onClick={onHelp}
          aria-label="How to explore"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A24B]/30 bg-[#0B0E14]/70 text-[#EDE6D6] backdrop-blur hover:border-[#C9A24B]"
        >
          <HelpCircle size={17} />
        </button>
      </div>
    </>
  );
}
