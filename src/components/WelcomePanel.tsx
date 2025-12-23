import { Card, CardContent } from '@/components/ui/card';
import { Lock, Key, Hash, Shield, ArrowRight, Layers } from 'lucide-react';

export function WelcomePanel() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-8">
        <div className="inline-flex p-4 rounded-2xl bg-primary/10 glow-primary animate-pulse-slow">
          <Lock className="h-16 w-16 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gradient-primary">
            Welcome to Encryption Lab
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore and understand cryptographic algorithms through interactive visualizations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border hover:border-chart-2/50 transition-colors">
            <CardContent className="p-4 text-center">
              <Key className="h-8 w-8 text-chart-2 mx-auto mb-2" />
              <h3 className="font-semibold text-foreground">Symmetric</h3>
              <p className="text-xs text-muted-foreground mt-1">
                AES, ChaCha20
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border hover:border-secondary/50 transition-colors">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground">Asymmetric</h3>
              <p className="text-xs text-muted-foreground mt-1">
                RSA, ECC, DH
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border hover:border-accent/50 transition-colors">
            <CardContent className="p-4 text-center">
              <Hash className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold text-foreground">Hashing</h3>
              <p className="text-xs text-muted-foreground mt-1">
                SHA-256, bcrypt
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-4 text-center">
              <Layers className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground">Modes</h3>
              <p className="text-xs text-muted-foreground mt-1">
                CBC, GCM, CTR
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ArrowRight className="h-4 w-4 text-primary animate-flow" />
          Select an algorithm from the sidebar to begin
        </div>
      </div>
    </div>
  );
}
