import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  encryptionModes, 
  EncryptionMode, 
  getModeSecurityBadge 
} from '@/lib/encryption-modes';
import { ModeBlockDiagram } from '@/components/ModeBlockDiagram';
import { 
  Layers, 
  Shield, 
  ShieldCheck, 
  ShieldX,
  Zap,
  Lock,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function EncryptionModes() {
  const [selectedMode, setSelectedMode] = useState<EncryptionMode>(encryptionModes[1]); // CBC default

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary/10">
          <Layers className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Encryption Modes</h2>
          <p className="text-sm text-muted-foreground">
            How block ciphers process data larger than one block
          </p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2">
        {encryptionModes.map((mode) => {
          const isSelected = selectedMode.id === mode.id;
          const badge = getModeSecurityBadge(mode.securityLevel);
          
          return (
            <Button
              key={mode.id}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "h-auto py-2 px-4 flex flex-col items-start gap-1",
                isSelected && "glow-primary"
              )}
              onClick={() => setSelectedMode(mode)}
            >
              <div className="flex items-center gap-2">
                {mode.securityLevel === 'high' && <ShieldCheck className="h-4 w-4" />}
                {mode.securityLevel === 'medium' && <Shield className="h-4 w-4" />}
                {mode.securityLevel === 'low' && <ShieldX className="h-4 w-4" />}
                <span className="font-semibold">{mode.name}</span>
              </div>
              <span className="text-xs opacity-80">{mode.fullName}</span>
            </Button>
          );
        })}
      </div>

      {/* Selected Mode Details */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="diagram">Block Diagram</TabsTrigger>
          <TabsTrigger value="comparison">Compare All</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Mode Header */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {selectedMode.name} - {selectedMode.fullName}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getModeSecurityBadge(selectedMode.securityLevel).variant}>
                      {getModeSecurityBadge(selectedMode.securityLevel).label}
                    </Badge>
                    {selectedMode.providesAuthentication && (
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        <Lock className="h-3 w-3 mr-1" />
                        AEAD
                      </Badge>
                    )}
                    {selectedMode.parallelizable && (
                      <Badge variant="outline" className="border-secondary/50 text-secondary">
                        <Zap className="h-3 w-3 mr-1" />
                        Parallel
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{selectedMode.description}</p>
              
              <div className="p-4 rounded-lg bg-muted/20 border border-border">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  How it works
                </h4>
                <p className="text-sm text-muted-foreground">{selectedMode.howItWorks}</p>
              </div>
            </CardContent>
          </Card>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedMode.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  Disadvantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedMode.cons.map((con, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-1">✗</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Requirements */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Requirements & Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-xs text-muted-foreground mb-1">IV Required</p>
                  <Badge variant={selectedMode.requiresIV ? "default" : "secondary"}>
                    {selectedMode.requiresIV ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-xs text-muted-foreground mb-1">Nonce Required</p>
                  <Badge variant={selectedMode.requiresNonce ? "default" : "secondary"}>
                    {selectedMode.requiresNonce ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-xs text-muted-foreground mb-1">Authentication</p>
                  <Badge variant={selectedMode.providesAuthentication ? "default" : "secondary"}>
                    {selectedMode.providesAuthentication ? "Built-in" : "No"}
                  </Badge>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/20">
                  <p className="text-xs text-muted-foreground mb-1">Parallelizable</p>
                  <Badge variant={selectedMode.parallelizable ? "default" : "secondary"}>
                    {selectedMode.parallelizable ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Use Cases */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Common Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedMode.useCases.map((useCase, i) => (
                  <Badge key={i} variant="outline" className="text-muted-foreground">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagram">
          <ModeBlockDiagram mode={selectedMode} />
        </TabsContent>

        <TabsContent value="comparison">
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader>
              <CardTitle>Mode Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Mode</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Security</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Auth</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Parallel</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">IV/Nonce</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {encryptionModes.map((mode) => (
                      <tr 
                        key={mode.id} 
                        className={cn(
                          "border-b border-border hover:bg-muted/20 cursor-pointer transition-colors",
                          selectedMode.id === mode.id && "bg-primary/10"
                        )}
                        onClick={() => setSelectedMode(mode)}
                      >
                        <td className="p-3">
                          <span className="font-semibold text-foreground">{mode.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{mode.fullName}</span>
                        </td>
                        <td className="p-3">
                          <Badge variant={getModeSecurityBadge(mode.securityLevel).variant}>
                            {getModeSecurityBadge(mode.securityLevel).label}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {mode.providesAuthentication ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </td>
                        <td className="p-3">
                          {mode.parallelizable ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {mode.requiresIV && "IV"}
                          {mode.requiresNonce && "Nonce"}
                          {!mode.requiresIV && !mode.requiresNonce && "None"}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {mode.useCases[0]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
