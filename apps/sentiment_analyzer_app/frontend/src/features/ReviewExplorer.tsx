import React, { useEffect, useState, useCallback } from 'react';
import { rpcCall } from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Spinner } from '../components/ui/spinner';
import { Search, Filter, MessageSquare, ExternalLink, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export const ReviewExplorer = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState('all');
  const [decision, setDecision] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await rpcCall({ 
        func: 'get_reviews', 
        args: { 
          sentiment: sentiment === 'all' ? null : sentiment,
          decision: decision === 'all' ? null : decision,
          limit: 100
        } 
      });
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [sentiment, decision]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = reviews.filter(r => 
    r.Text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.Summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSentimentVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'positive': return 'default'; // Theme primary (blue)
      case 'negative': return 'destructive';
      default: return 'secondary';
    }
  };

  const getDecisionVariant = (d: string) => {
    switch (d.toLowerCase()) {
      case 'repurchased': return 'outline';
      case 'churned': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-xl">Review Explorer</CardTitle>
              <CardDescription>Drill down into specific customer feedback segments</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search reviews..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={sentiment} onValueChange={setSentiment}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
              <Select value={decision} onValueChange={setDecision}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Decisions</SelectItem>
                  <SelectItem value="Repurchased">Repurchased</SelectItem>
                  <SelectItem value="Churned">Churned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Spinner className="h-8 w-8 text-primary" />
              <p className="text-sm text-muted-foreground">Fetching reviews from database...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">Rating</TableHead>
                    <TableHead>Review Preview</TableHead>
                    <TableHead>AI Sentiment</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead className="text-right">Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        No reviews found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReviews.map((review) => (
                      <TableRow key={review.id} className="group cursor-default hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            {review.Score} ⭐
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-sm truncate">{review.Summary}</span>
                            <p className="text-xs text-muted-foreground line-clamp-2">{review.Text}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getSentimentVariant(review.sentiment)} 
                            className="capitalize"
                          >
                            {review.sentiment}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={getDecisionVariant(review.purchase_decision)}
                            className={cn(
                              "capitalize font-normal",
                              review.purchase_decision === 'Churned' && "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50"
                            )}
                          >
                            {review.purchase_decision}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {(review.confidence * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
