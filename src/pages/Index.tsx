import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AlgorithmSidebar } from '@/components/AlgorithmSidebar';
import { AlgorithmExplanation } from '@/components/AlgorithmExplanation';
import { VisualFlow } from '@/components/VisualFlow';
import { InteractiveDemo } from '@/components/InteractiveDemo';
import { ComparisonTable } from '@/components/ComparisonTable';
import { WelcomePanel } from '@/components/WelcomePanel';
import { EncryptionModes } from '@/components/EncryptionModes';
import { AIAdvisor } from '@/components/AIAdvisor';
import { Algorithm } from '@/lib/algorithms';
import { BookOpen, Play, GitCompare, Menu, X, Layers, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [activeTab, setActiveTab] = useState('learn');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectAlgorithm = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    setActiveTab('learn');
    setSidebarOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Encryption Lab – Visual Crypto Playground | Learn Cryptography</title>
        <meta 
          name="description" 
          content="Learn encryption algorithms visually. Explore AES, RSA, SHA-256, and more through interactive demos. Understand symmetric, asymmetric, and hashing algorithms." 
        />
        <meta name="keywords" content="encryption, cryptography, AES, RSA, SHA-256, cybersecurity, education, hashing, symmetric encryption, asymmetric encryption" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background cyber-grid">
        <Header />
        
        <div className="flex-1 flex">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="fixed bottom-4 right-4 z-50 md:hidden rounded-full h-12 w-12 bg-primary text-primary-foreground shadow-lg glow-primary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Sidebar - hidden on mobile unless open */}
          <div className={cn(
            "fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:transform-none",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}>
            <AlgorithmSidebar
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={handleSelectAlgorithm}
            />
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-background/80 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {selectedAlgorithm ? (
              <div className="h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="border-b border-border bg-card/30 px-4 py-2">
                    <TabsList className="bg-muted/30">
                      <TabsTrigger value="learn" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Learn</span>
                      </TabsTrigger>
                      <TabsTrigger value="demo" className="gap-2">
                        <Play className="h-4 w-4" />
                        <span className="hidden sm:inline">Demo</span>
                      </TabsTrigger>
                      <TabsTrigger value="modes" className="gap-2">
                        <Layers className="h-4 w-4" />
                        <span className="hidden sm:inline">Modes</span>
                      </TabsTrigger>
                      <TabsTrigger value="ai" className="gap-2">
                        <Bot className="h-4 w-4" />
                        <span className="hidden sm:inline">AI Advisor</span>
                      </TabsTrigger>
                      <TabsTrigger value="compare" className="gap-2">
                        <GitCompare className="h-4 w-4" />
                        <span className="hidden sm:inline">Compare</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <ScrollArea className="flex-1">
                    <TabsContent value="learn" className="m-0 p-6 space-y-6">
                      <AlgorithmExplanation algorithm={selectedAlgorithm} />
                      <VisualFlow algorithm={selectedAlgorithm} />
                    </TabsContent>

                    <TabsContent value="demo" className="m-0 p-6">
                      <InteractiveDemo algorithm={selectedAlgorithm} />
                    </TabsContent>

                    <TabsContent value="modes" className="m-0 p-6">
                      <EncryptionModes />
                    </TabsContent>

                    <TabsContent value="ai" className="m-0 p-6">
                      <AIAdvisor algorithm={selectedAlgorithm.name} />
                    </TabsContent>

                    <TabsContent value="compare" className="m-0 p-6">
                      <ComparisonTable onSelectAlgorithm={handleSelectAlgorithm} />
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </div>
            ) : (
              <WelcomePanel />
            )}
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Index;
