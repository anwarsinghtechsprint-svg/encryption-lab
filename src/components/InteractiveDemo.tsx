import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Algorithm } from '@/lib/algorithms';
import {
  simpleEncrypt,
  simpleDecrypt,
  sha256Hash,
  sha512Hash,
  md5Hash,
  bcryptHash,
  rsaEncrypt,
  rsaDecrypt,
  generateRandomKey,
  generateKeyPair,
  generateDHKeyPair,
  computeDHSharedSecret
} from '@/lib/crypto-utils';
import {
  Play,
  RefreshCw,
  Key,
  Lock,
  Unlock,
  Copy,
  Check,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface InteractiveDemoProps {
  algorithm: Algorithm;
}

export function InteractiveDemo({ algorithm }: InteractiveDemoProps) {
  const [input, setInput] = useState('Hello, World!');
  const [key, setKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [output, setOutput] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // DH specific state
  const [dhAlice, setDhAlice] = useState<{ privateKey: number; publicKey: number; p: number; g: number } | null>(null);
  const [dhBob, setDhBob] = useState<{ privateKey: number; publicKey: number; p: number; g: number } | null>(null);
  const [sharedSecret, setSharedSecret] = useState<number | null>(null);

  const handleGenerateKey = useCallback(() => {
    if (algorithm.type === 'symmetric') {
      setKey(generateRandomKey(16));
      toast.success('Random key generated!');
    } else if (algorithm.type === 'asymmetric' && algorithm.id !== 'diffie-hellman') {
      const pair = generateKeyPair();
      setPublicKey(pair.publicKey);
      setPrivateKey(pair.privateKey);
      toast.success('Key pair generated!');
    }
  }, [algorithm]);

  const handleProcess = useCallback(async () => {
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsProcessing(true);
    setOutput('');
    setDecrypted('');

    try {
      // Simulate processing delay for visual effect
      await new Promise(resolve => setTimeout(resolve, 500));

      switch (algorithm.id) {
        case 'aes':
        case 'chacha20': {
          if (!key) {
            toast.error('Please generate or enter a key');
            setIsProcessing(false);
            return;
          }
          const encrypted = simpleEncrypt(input, key);
          setOutput(encrypted);
          const decryptedText = simpleDecrypt(encrypted, key);
          setDecrypted(decryptedText);
          break;
        }
        case 'rsa':
        case 'ecc': {
          if (!publicKey || !privateKey) {
            toast.error('Please generate a key pair');
            setIsProcessing(false);
            return;
          }
          const rsaEncrypted = rsaEncrypt(input, publicKey);
          setOutput(rsaEncrypted);
          const rsaDecrypted = rsaDecrypt(rsaEncrypted, privateKey, publicKey);
          setDecrypted(rsaDecrypted);
          break;
        }
        case 'diffie-hellman': {
          const alice = generateDHKeyPair();
          const bob = generateDHKeyPair();
          setDhAlice(alice);
          setDhBob(bob);
          const secret = computeDHSharedSecret(alice.privateKey, bob.publicKey, alice.p);
          setSharedSecret(secret);
          setOutput(`Shared Secret: ${secret}`);
          break;
        }
        case 'sha256': {
          const hash = await sha256Hash(input);
          setOutput(hash);
          break;
        }
        case 'sha512': {
          const hash = await sha512Hash(input);
          setOutput(hash);
          break;
        }
        case 'md5': {
          const hash = md5Hash(input);
          setOutput(hash);
          break;
        }
        case 'bcrypt': {
          const hash = bcryptHash(input, 10);
          setOutput(hash);
          break;
        }
        default:
          setOutput('Algorithm demo not implemented');
      }

      toast.success('Processing complete!');
    } catch (error) {
      toast.error('Processing failed');
      console.error(error);
    }

    setIsProcessing(false);
  }, [algorithm, input, key, publicKey, privateKey]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleReset = useCallback(() => {
    setInput('Hello, World!');
    setKey('');
    setPublicKey('');
    setPrivateKey('');
    setOutput('');
    setDecrypted('');
    setDhAlice(null);
    setDhBob(null);
    setSharedSecret(null);
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Interactive Demo
          <Badge variant="outline" className="ml-2">Educational</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <Label htmlFor="input" className="flex items-center gap-2">
            Input {algorithm.type === 'hashing' ? 'Message' : 'Plaintext'}
          </Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to process..."
            className="font-mono text-sm bg-background border-border"
            rows={3}
          />
        </div>

        {/* Key Section - for symmetric encryption */}
        {algorithm.type === 'symmetric' && (
          <div className="space-y-2">
            <Label htmlFor="key" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Secret Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter or generate a key..."
                className="font-mono text-sm bg-background border-border"
              />
              <Button variant="outline" onClick={handleGenerateKey} size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Generate
              </Button>
            </div>
          </div>
        )}

        {/* Key Pair Section - for asymmetric encryption (non-DH) */}
        {algorithm.type === 'asymmetric' && algorithm.id !== 'diffie-hellman' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Key Pair
              </Label>
              <Button variant="outline" onClick={handleGenerateKey} size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Generate Pair
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Public Key</Label>
                <Input
                  value={publicKey}
                  readOnly
                  className="font-mono text-xs bg-background border-border"
                  placeholder="Public key..."
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Private Key</Label>
                <Input
                  value={privateKey}
                  readOnly
                  className="font-mono text-xs bg-background border-border"
                  placeholder="Private key..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Process Button */}
        <div className="flex gap-2">
          <Button 
            onClick={handleProcess} 
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {algorithm.type === 'hashing' ? 'Generate Hash' : 'Encrypt'}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Output Section */}
        {output && (
          <div className="space-y-3 pt-4 border-t border-border">
            {/* DH specific output */}
            {algorithm.id === 'diffie-hellman' && dhAlice && dhBob && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Card className="p-3 bg-muted/20">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Alice</h4>
                  <p className="text-xs text-muted-foreground">Private: {dhAlice.privateKey}</p>
                  <p className="text-xs text-muted-foreground">Public: {dhAlice.publicKey}</p>
                </Card>
                <Card className="p-3 bg-muted/20">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Bob</h4>
                  <p className="text-xs text-muted-foreground">Private: {dhBob.privateKey}</p>
                  <p className="text-xs text-muted-foreground">Public: {dhBob.publicKey}</p>
                </Card>
              </div>
            )}

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                {algorithm.type === 'hashing' ? 'Hash Output' : 'Encrypted Output'}
              </Label>
              <div className="relative">
                <Textarea
                  value={output}
                  readOnly
                  className="font-mono text-xs bg-primary/5 border-primary/30 pr-10"
                  rows={3}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(output)}
                >
                  {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Decrypted output for encryption algorithms */}
            {algorithm.canDecrypt && decrypted && algorithm.type !== 'hashing' && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Unlock className="h-4 w-4 text-primary" />
                  Decrypted Output
                </Label>
                <Textarea
                  value={decrypted}
                  readOnly
                  className="font-mono text-sm bg-primary/5 border-primary/30"
                  rows={2}
                />
              </div>
            )}

            {/* Warning for hashing */}
            {algorithm.type === 'hashing' && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-muted/30 border border-border">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
                <p className="text-sm text-muted-foreground">
                  ⚠️ Hashing is one-way. The original input cannot be recovered from the hash.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Educational note */}
        <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
          Note: This is a simplified demonstration for educational purposes. 
          Real implementations use proper cryptographic libraries.
        </p>
      </CardContent>
    </Card>
  );
}
