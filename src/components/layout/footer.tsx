import { LayoutGrid } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">ArtFolio</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} saidulalimallick studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
