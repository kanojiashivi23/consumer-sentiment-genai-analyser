import React, { useState } from 'react';
import { rpcCall } from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Spinner } from '../components/ui/spinner';
import { 
  Sparkles, Send, RefreshCcw, 
  CheckCircle2, AlertTriangle, AlertCircle, Info,
  Lightbulb
} from 'lucide-react';
import { SiHuggingface } from 'react-icons/si';

export const AILab = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await rpcCall({ func: 'analyze_text', args: { text } });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'positive': return 'text-emerald-500';
      case 'negative': return 'text-rose-500';
      case 'neutral': return 'text-amber-500';
      default: return 'text-primary';
    }
  };

  const getSentimentBg = (s: string) => {
    switch (s?.toLowerCase()) {
      case 'positive': return 'bg-emerald-500/10';
      case 'negative': return 'bg-rose-500/10';
      case 'neutral': return 'bg-amber-500/10';
      default: return 'bg-primary/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-500 rounded-lg">
          <SiHuggingface className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading">AI Analysis Lab</h1>
          <p className="text-muted-foreground text-sm">Test the model on custom review text</p>
        </div>
      </div>

      <Card className="border-t-4 border-t-blue-500 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Input Review
          </CardTitle>
          <CardDescription>
            Paste a customer review below to see how our NLP model predicts sentiment and confidence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Example: The packaging was damaged when it arrived, but the coffee inside was absolutely delicious. Best dark roast I've had in years!"
            className="min-h-[200px] text-base resize-none focus-visible:ring-blue-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t bg-muted/30 pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            <span>Powered by Gemini-2.5-Flash-Lite</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setText('')} disabled={loading}>
              Clear
            </Button>
            <Button onClick={handleAnalyze} disabled={loading || !text.trim()} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Analyze Text
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {error && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-4 flex items-center gap-3 text-rose-700">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="md:col-span-2 overflow-hidden">
            <div className={`h-2 w-full ${getSentimentBg(result.sentiment)}`} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading">AI Insight</CardTitle>
                <Badge className={`capitalize text-white border-0 ${getSentimentBg(result.sentiment).replace('/10', '')}`}>
                  {result.sentiment}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-foreground italic leading-relaxed">
                  "{result.explanation}"
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Model Confidence</span>
                  <span className="font-mono">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <Progress value={result.confidence * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lightbulb className="h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-blue-50">
              <p>Based on this sentiment analysis, we recommend:</p>
              <ul className="space-y-2 list-disc pl-4">
                {result.sentiment === 'negative' ? (
                  <>
                    <li>Flag for customer support follow-up</li>
                    <li>Investigate root cause of dissatisfaction</li>
                    <li>Offer retention incentive</li>
                  </>
                ) : result.sentiment === 'positive' ? (
                  <>
                    <li>Invite to loyalty program</li>
                    <li>Encourage social sharing</li>
                    <li>Analyze for high-value keywords</li>
                  </>
                ) : (
                  <>
                    <li>Monitor for follow-up purchases</li>
                    <li>Ask for specific feedback points</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
