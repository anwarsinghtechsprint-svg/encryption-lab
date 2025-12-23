import { Card } from '@/components/ui/card';
import { Algorithm } from '@/lib/algorithms';
import { 
  FileText, 
  Key, 
  KeyRound, 
  Cog, 
  Lock, 
  Unlock, 
  FileOutput,
  ArrowRight,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisualFlowProps {
  algorithm: Algorithm;
}

export function VisualFlow({ algorithm }: VisualFlowProps) {
  const getStepIcon = (icon: string) => {
    const iconClass = "h-6 w-6";
    switch (icon) {
      case 'input': return <FileText className={cn(iconClass, "text-chart-2")} />;
      case 'key': return <Key className={cn(iconClass, "text-chart-4")} />;
      case 'process': return <Cog className={cn(iconClass, "text-secondary")} />;
      case 'output': return <FileOutput className={cn(iconClass, "text-primary")} />;
      case 'lock': return <Lock className={cn(iconClass, "text-primary")} />;
      case 'unlock': return <Unlock className={cn(iconClass, "text-primary")} />;
      default: return <Hash className={cn(iconClass, "text-muted-foreground")} />;
    }
  };

  const getStepColor = (icon: string) => {
    switch (icon) {
      case 'input': return 'border-chart-2/50 bg-chart-2/10';
      case 'key': return 'border-chart-4/50 bg-chart-4/10';
      case 'process': return 'border-secondary/50 bg-secondary/10';
      case 'output': return 'border-primary/50 bg-primary/10';
      case 'lock': return 'border-primary/50 bg-primary/10';
      case 'unlock': return 'border-primary/50 bg-primary/10';
      default: return 'border-muted bg-muted/10';
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        <Cog className="h-5 w-5 text-secondary animate-spin-slow" style={{ animationDuration: '8s' }} />
        Algorithm Flow
      </h3>
      
      <div className="flex flex-wrap items-center justify-center gap-2">
        {algorithm.flowSteps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={cn(
                "flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105",
                getStepColor(step.icon)
              )}
              style={{ minWidth: '120px' }}
            >
              <div className="p-2 rounded-full bg-background/50 mb-2">
                {getStepIcon(step.icon)}
              </div>
              <span className="text-sm font-semibold text-foreground text-center">
                {step.label}
              </span>
              <span className="text-xs text-muted-foreground text-center mt-1 max-w-[100px]">
                {step.description}
              </span>
            </div>
            
            {index < algorithm.flowSteps.length - 1 && (
              <div className="flex items-center px-2">
                <ArrowRight className="h-6 w-6 text-primary animate-flow" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Decryption note */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          {algorithm.canDecrypt ? (
            <span className="flex items-center justify-center gap-2">
              <Unlock className="h-4 w-4 text-primary" />
              This algorithm supports decryption/verification
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4 text-destructive" />
              ⚠️ One-way function - Decryption is NOT possible
            </span>
          )}
        </p>
      </div>
    </Card>
  );
}
