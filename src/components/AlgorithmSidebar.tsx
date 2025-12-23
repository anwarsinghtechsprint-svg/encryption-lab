import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  KeyRound, 
  Hash, 
  Shield, 
  ShieldAlert, 
  ShieldX,
  Lock,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { algorithmCategories, Algorithm, getSecurityLevelBadge } from '@/lib/algorithms';
import { cn } from '@/lib/utils';

interface AlgorithmSidebarProps {
  selectedAlgorithm: Algorithm | null;
  onSelectAlgorithm: (algorithm: Algorithm) => void;
}

export function AlgorithmSidebar({ selectedAlgorithm, onSelectAlgorithm }: AlgorithmSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    algorithmCategories.map(c => c.name)
  );

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'symmetric': return <Key className="h-4 w-4" />;
      case 'asymmetric': return <KeyRound className="h-4 w-4" />;
      case 'hashing': return <Hash className="h-4 w-4" />;
      default: return <Lock className="h-4 w-4" />;
    }
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'high': return <Shield className="h-3 w-3 text-primary" />;
      case 'medium': return <ShieldAlert className="h-3 w-3 text-chart-4" />;
      case 'broken': return <ShieldX className="h-3 w-3 text-destructive" />;
      default: return null;
    }
  };

  return (
    <div className="w-72 border-r border-border bg-sidebar flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Algorithms</h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Select an algorithm to explore
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {algorithmCategories.map((category) => (
            <div key={category.name} className="mb-2">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                {expandedCategories.includes(category.name) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                {getTypeIcon(category.algorithms[0]?.type)}
                <span className="text-sm font-medium text-foreground">
                  {category.name}
                </span>
              </button>
              
              {expandedCategories.includes(category.name) && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.algorithms.map((algorithm) => {
                    const isSelected = selectedAlgorithm?.id === algorithm.id;
                    const securityBadge = getSecurityLevelBadge(algorithm.securityLevel);
                    
                    return (
                      <Button
                        key={algorithm.id}
                        variant={isSelected ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-auto py-2 px-3",
                          isSelected && "bg-primary/10 border border-primary/30"
                        )}
                        onClick={() => onSelectAlgorithm(algorithm)}
                      >
                        <div className="flex flex-col items-start gap-1 w-full">
                          <div className="flex items-center gap-2 w-full">
                            {getSecurityIcon(algorithm.securityLevel)}
                            <span className="text-sm font-medium truncate">
                              {algorithm.name.split(' (')[0]}
                            </span>
                          </div>
                          {algorithm.securityLevel === 'broken' && (
                            <Badge variant="destructive" className="text-xs h-5">
                              ⚠️ Insecure
                            </Badge>
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
