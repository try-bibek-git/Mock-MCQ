import { Github } from 'lucide-react';
import Link from 'next/link';

export default function AppFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              PDFPrep is an AI-powered application that helps you generate Multiple Choice Questions (MCQs) 
              and create mock tests from your PDF documents. Perfect for students, teachers, and educational content creators.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="https://github.com/try-bibek-git/Mock-MCQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-6 w-6" />
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} bibek2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 