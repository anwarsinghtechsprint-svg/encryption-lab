import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { algorithms, getSecurityLevelBadge, getTypeLabel, Algorithm } from '@/lib/algorithms';
import { GitCompare, Shield, Zap, Key, Target } from 'lucide-react';

interface ComparisonTableProps {
  onSelectAlgorithm: (algorithm: Algorithm) => void;
}

export function ComparisonTable({ onSelectAlgorithm }: ComparisonTableProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-secondary" />
          Algorithm Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Algorithm</TableHead>
                <TableHead className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Key className="h-4 w-4" />
                    Type
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Speed
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Security
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground">Key Size</TableHead>
                <TableHead className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    Primary Use Case
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {algorithms.map((algorithm) => {
                const securityBadge = getSecurityLevelBadge(algorithm.securityLevel);
                return (
                  <TableRow 
                    key={algorithm.id} 
                    className="border-border cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => onSelectAlgorithm(algorithm)}
                  >
                    <TableCell className="font-medium text-foreground">
                      {algorithm.name.split(' (')[0]}
                      {algorithm.securityLevel === 'broken' && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          ⚠️
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(algorithm.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {algorithm.speed}
                    </TableCell>
                    <TableCell>
                      <Badge variant={securityBadge.variant} className="text-xs">
                        {algorithm.securityLevel.charAt(0).toUpperCase() + algorithm.securityLevel.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {algorithm.keySize}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {algorithm.realWorldUsage[0]}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
