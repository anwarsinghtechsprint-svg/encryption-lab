import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Algorithm, getSecurityLevelBadge, getTypeLabel } from '@/lib/algorithms';
import { 
  BookOpen, 
  HelpCircle, 
  Key, 
  Shield, 
  Globe,
  AlertTriangle
} from 'lucide-react';

interface AlgorithmExplanationProps {
  algorithm: Algorithm;
}

export function AlgorithmExplanation({ algorithm }: AlgorithmExplanationProps) {
  const securityBadge = getSecurityLevelBadge(algorithm.securityLevel);
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{algorithm.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="border-primary/50 text-primary">
              {getTypeLabel(algorithm.type)}
            </Badge>
            <Badge variant={securityBadge.variant}>
              {securityBadge.label}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Key Size</p>
          <p className="font-mono text-sm text-foreground">{algorithm.keySize}</p>
        </div>
      </div>

      {/* Warnings for insecure algorithms */}
      {algorithm.warnings && algorithm.warnings.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-destructive flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5" />
              Security Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {algorithm.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-destructive/90 flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Main explanation cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              What is it?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {algorithm.description}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-secondary" />
              Why is it used?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {algorithm.whyUsed}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Technical details */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4 text-chart-2" />
              Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {getTypeLabel(algorithm.type)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {algorithm.type === 'symmetric' && 'Single shared key'}
              {algorithm.type === 'asymmetric' && 'Public/Private key pair'}
              {algorithm.type === 'hashing' && 'One-way transformation'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Security Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={securityBadge.variant} className="text-sm">
              {securityBadge.label}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Speed: {algorithm.speed}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent" />
              Real-World Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {algorithm.realWorldUsage.slice(0, 4).map((usage, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-primary">→</span>
                  {usage}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
