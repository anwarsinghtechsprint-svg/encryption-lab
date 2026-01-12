import { Lock, Shield, Sparkles, Type, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 glow-primary">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-primary">
                Encryption Lab
              </h1>
              <p className="text-xs text-muted-foreground">
                Visual Crypto Playground
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Powered by Google Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20">
              <span className="text-xs font-medium text-muted-foreground">Powered by</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 gap-1 bg-primary/20 hover:bg-primary/30 border-primary/30">
                  <Sparkles className="h-3 w-3" />
                  Gemini AI
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 gap-1 bg-accent/20 hover:bg-accent/30 border-accent/30">
                  <ShieldCheck className="h-3 w-3" />
                  Web Crypto
                </Badge>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 gap-1 bg-secondary/20 hover:bg-secondary/30 border-secondary/30">
                  <Type className="h-3 w-3" />
                  Google Fonts
                </Badge>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Educational Demo
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
