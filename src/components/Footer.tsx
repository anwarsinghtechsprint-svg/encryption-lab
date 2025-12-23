import { Lock, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Encryption Lab – Visual Crypto Playground
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground text-center max-w-xl">
            This project is built for <span className="text-primary font-medium">educational and demonstration purposes</span> to 
            understand how encryption algorithms work in cyber security. Not for production use.
          </p>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="h-3 w-3 text-destructive" /> for learning
          </div>
        </div>
      </div>
    </footer>
  );
}
