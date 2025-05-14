import { Github, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function AppFooter() {
  return (
    <footer className="border-t mt-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <Link 
              href="https://github.com/try-bibek-git/Mock-MCQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.instagram.com/your_instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link 
              href="https://www.linkedin.com/in/your_linkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} bibek2025
            </p>
            <p className="text-xs text-muted-foreground/70">
              Built with Next.js and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 