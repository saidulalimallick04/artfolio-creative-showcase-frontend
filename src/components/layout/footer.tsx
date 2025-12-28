import { LayoutGrid } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">ArtFolio</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="https://github.com/saidulalimallick04" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/saidulalimallick04" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="https://x.com/saidulmallick04" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</a>
          </div>

          <p className="text-sm text-muted-foreground text-center sm:text-right">
            © {new Date().getFullYear()} saidulalimallick studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
