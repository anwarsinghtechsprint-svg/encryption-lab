import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIAdvisorProps {
  algorithm?: string;
}

export function AIAdvisor({ algorithm }: AIAdvisorProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = algorithm
    ? [
        `How does ${algorithm} work step by step?`,
        `Is ${algorithm} secure for modern use?`,
        `What are common attacks against ${algorithm}?`,
      ]
    : [
        "What's the difference between symmetric and asymmetric encryption?",
        "Why is MD5 considered broken?",
        "How does AES-GCM provide authentication?",
      ];

  const askQuestion = async (q: string) => {
    if (!q.trim()) return;
    
    setIsLoading(true);
    setAnswer('');

    try {
      const { data, error } = await supabase.functions.invoke('crypto-advisor', {
        body: { question: q, algorithm },
      });

      if (error) {
        console.error('Function error:', error);
        if (error.message?.includes('429')) {
          toast.error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        } else {
          toast.error('Failed to get response. Please try again.');
        }
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setAnswer(data.answer);
    } catch (err) {
      console.error('Request error:', err);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              AI Crypto Advisor
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                Powered by Google Gemini
              </span>
            </CardTitle>
            <CardDescription>
              Ask questions about cryptography and security
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Suggested Questions */}
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1.5 px-3"
              onClick={() => {
                setQuestion(q);
                askQuestion(q);
              }}
              disabled={isLoading}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {q.length > 40 ? q.slice(0, 40) + '...' : q}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about encryption, security, or algorithms..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                askQuestion(question);
              }
            }}
          />
          <Button
            onClick={() => askQuestion(question)}
            disabled={isLoading || !question.trim()}
            size="icon"
            className="h-auto min-h-[60px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Answer */}
        {answer && (
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              <Bot className="h-3 w-3" />
              <span>Google Gemini Response</span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {answer.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0 text-sm text-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {isLoading && !answer && (
          <div className="flex items-center justify-center gap-2 p-4 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Gemini is thinking...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
