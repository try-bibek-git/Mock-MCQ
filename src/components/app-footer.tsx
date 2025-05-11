import { Github } from 'lucide-react';
import Link from 'next/link';

export default function AppFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-center items-center gap-4">
          <Link 
            href="https://github.com/try-bibek-git/Mock-MCQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
          </Link>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} bibek2025
          </p>
        </div>
      </div>
    </footer>
  );
} 