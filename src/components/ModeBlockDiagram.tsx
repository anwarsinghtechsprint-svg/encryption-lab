import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EncryptionMode } from '@/lib/encryption-modes';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';

interface ModeBlockDiagramProps {
  mode: EncryptionMode;
}

export function ModeBlockDiagram({ mode }: ModeBlockDiagramProps) {
  const getBlockStyle = (type: string) => {
    switch (type) {
      case 'plaintext':
        return 'bg-chart-2/20 border-chart-2/50 text-chart-2';
      case 'ciphertext':
        return 'bg-primary/20 border-primary/50 text-primary';
      case 'iv':
        return 'bg-chart-4/20 border-chart-4/50 text-chart-4';
      case 'nonce':
      case 'counter':
        return 'bg-accent/20 border-accent/50 text-accent';
      case 'xor':
        return 'bg-secondary/20 border-secondary/50 text-secondary';
      case 'encrypt':
        return 'bg-primary/30 border-primary text-primary-foreground';
      case 'auth':
        return 'bg-chart-3/20 border-chart-3/50 text-chart-3';
      case 'tag':
        return 'bg-primary/40 border-primary text-primary';
      default:
        return 'bg-muted/20 border-muted text-muted-foreground';
    }
  };

  // Get unique rows and cols
  const rows = [...new Set(mode.blocks.map(b => b.row))].sort((a, b) => a - b);
  const cols = [...new Set(mode.blocks.map(b => b.col))].sort((a, b) => a - b);
  
  // Create a grid
  const grid: (typeof mode.blocks[0] | null)[][] = rows.map(() => 
    cols.map(() => null)
  );
  
  mode.blocks.forEach(block => {
    const rowIndex = rows.indexOf(block.row);
    const colIndex = cols.indexOf(block.col);
    if (rowIndex >= 0 && colIndex >= 0) {
      grid[rowIndex][colIndex] = block;
    }
  });

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-secondary" />
          {mode.name} Block Diagram
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Visual representation of how {mode.fullName} processes data blocks
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[600px]">
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-6 p-3 rounded-lg bg-muted/10 border border-border">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-chart-2/20 border border-chart-2/50" />
                <span className="text-xs text-muted-foreground">Plaintext</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20 border border-primary/50" />
                <span className="text-xs text-muted-foreground">Ciphertext</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/30 border border-primary" />
                <span className="text-xs text-muted-foreground">Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-secondary/20 border border-secondary/50" />
                <span className="text-xs text-muted-foreground">XOR</span>
              </div>
              {mode.requiresIV && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-chart-4/20 border border-chart-4/50" />
                  <span className="text-xs text-muted-foreground">IV</span>
                </div>
              )}
              {mode.requiresNonce && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent/20 border border-accent/50" />
                  <span className="text-xs text-muted-foreground">Nonce/Counter</span>
                </div>
              )}
              {mode.providesAuthentication && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-chart-3/20 border border-chart-3/50" />
                  <span className="text-xs text-muted-foreground">Auth</span>
                </div>
              )}
            </div>

            {/* Block Diagram */}
            <div className="space-y-4">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center justify-center gap-2">
                  {row.map((block, colIndex) => (
                    <div key={colIndex} className="flex items-center">
                      {block ? (
                        <div
                          className={cn(
                            "relative px-4 py-3 rounded-lg border-2 text-center min-w-[90px] transition-all duration-300 hover:scale-105",
                            getBlockStyle(block.type)
                          )}
                        >
                          <span className="text-sm font-medium">{block.label}</span>
                          
                          {/* Vertical arrow down */}
                          {block.connections?.some(c => {
                            const target = mode.blocks.find(b => b.id === c.to);
                            return target && target.row > block.row && target.col === block.col;
                          }) && (
                            <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
                              <div className="w-0.5 h-3 bg-muted-foreground/50" />
                              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-muted-foreground/50 -mt-px" />
                            </div>
                          )}
                          
                          {/* Horizontal arrow for chaining */}
                          {block.connections?.some(c => {
                            const target = mode.blocks.find(b => b.id === c.to);
                            return target && target.col > block.col && c.label === 'chain';
                          }) && (
                            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex items-center">
                              <div className="w-6 h-0.5 bg-primary/50" />
                              <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-primary/50" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-[90px]" />
                      )}
                      
                      {/* Arrow between columns */}
                      {colIndex < row.length - 1 && row[colIndex + 1] && block && !block.connections?.some(c => c.label === 'chain') && (
                        <div className="mx-1 text-muted-foreground/30">→</div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Flow explanation */}
            <div className="mt-6 p-4 rounded-lg bg-muted/10 border border-border">
              <h4 className="font-semibold text-foreground mb-2">Data Flow</h4>
              <p className="text-sm text-muted-foreground">
                {mode.id === 'ecb' && (
                  "Each plaintext block is encrypted independently. No chaining between blocks."
                )}
                {mode.id === 'cbc' && (
                  "The IV is XORed with the first block. Each subsequent block is XORed with the previous ciphertext before encryption, creating a chain."
                )}
                {mode.id === 'ctr' && (
                  "A counter combined with a nonce is encrypted to create a keystream. The keystream is XORed with plaintext. Each block can be processed independently."
                )}
                {mode.id === 'gcm' && (
                  "Counter mode encryption with parallel GHASH authentication. The auth tag is computed over all ciphertext blocks using Galois field multiplication."
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
