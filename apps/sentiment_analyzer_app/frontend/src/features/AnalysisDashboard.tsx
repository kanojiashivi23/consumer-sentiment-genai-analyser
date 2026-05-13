import React, { useEffect, useState, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line, Area
} from 'recharts';
import { rpcCall } from '../api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Users, TrendingDown, Target, Activity, 
  ShoppingBag, CheckCircle2, AlertTriangle, Info
} from 'lucide-react';
import { FaAmazon } from 'react-icons/fa';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const AnalysisDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, analysisData] = await Promise.all([
        rpcCall({ func: 'get_stats' }),
        rpcCall({ func: 'get_analysis_data' })
      ]);
      setStats(statsData);
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  // Process Cross-tab data for stacked bar
  // Shape: [{ sentiment: 'positive', 'Repurchased': 10, 'Churned': 5 }, ...]
  const sentimentMap: Record<string, any> = {};
  analysis?.cross_tab?.forEach((item: any) => {
    if (!sentimentMap[item.sentiment]) {
      sentimentMap[item.sentiment] = { sentiment: item.sentiment };
    }
    sentimentMap[item.sentiment][item.purchase_decision] = item.count;
  });
  const crossTabData = Object.values(sentimentMap);

  // Process Score Match data
  // Shape: [{ expected: 'positive', actual: 'positive', count: 10 }, ...]
  const scoreMatchData = analysis?.score_match?.map((item: any) => ({
    name: `${item.expected_sentiment} (Rating) → ${item.sentiment} (AI)`,
    value: item.count
  }));

  const pieData = Object.entries(stats?.distribution || {}).map(([name, value]) => ({ name, value: value as number }));

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'url(./assets/texture-mesh-1.jpg)', backgroundSize: 'cover' }} />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{stats?.total?.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'url(./assets/texture-mesh-1.jpg)', backgroundSize: 'cover' }} />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Churn Rate</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{(stats?.churn_rate * 100).toFixed(1)}%</h3>
              </div>
              <div className="p-3 bg-rose-500/10 rounded-lg">
                <TrendingDown className="h-5 w-5 text-rose-500" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
               <div className="h-full bg-rose-500" style={{ width: `${stats?.churn_rate * 100}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'url(./assets/texture-mesh-1.jpg)', backgroundSize: 'cover' }} />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                <h3 className="text-2xl font-bold mt-1 font-heading">{(stats?.avg_confidence * 100).toFixed(1)}%</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Target className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'url(./assets/texture-mesh-1.jpg)', backgroundSize: 'cover' }} />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform</p>
                <div className="flex items-center gap-2 mt-1">
                  <FaAmazon className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-bold font-heading">Amazon Food</h3>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Sentiment vs Purchase Decision</CardTitle>
            <CardDescription>Correlation between AI sentiment and customer churn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crossTabData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="sentiment" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Repurchased" stackId="a" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Churned" stackId="a" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Sentiment Distribution</CardTitle>
            <CardDescription>Overall breakdown of review sentiment</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accuracy Row */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <CardTitle className="font-heading text-lg">Rating vs. AI Alignment</CardTitle>
          </div>
          <CardDescription>Identifying 'Hidden Signals' where star ratings diverge from true sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis?.score_match} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey={(d) => `${d.expected_sentiment} ⭐ → ${d.sentiment}`} 
                  type="category" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11} 
                  width={150}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[0, 4, 4, 0]}
                >
                  {analysis?.score_match?.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.expected_sentiment === entry.sentiment ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-5))'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex items-start gap-2 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Alignment:</span> Green bars show reviews where AI sentiment matches expectations derived from star ratings.</p>
             </div>
             <div className="flex items-start gap-2 p-3 bg-rose-500/5 rounded-lg border border-rose-500/10 text-xs">
                <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5" />
                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Hidden Signals:</span> Rose bars highlight reviews with high star ratings but negative sentiment (or vice versa), revealing underlying issues.</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
