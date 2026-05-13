import React, { useState, useEffect } from 'react';
import { AnalysisDashboard } from './features/AnalysisDashboard';
import { ReviewExplorer } from './features/ReviewExplorer';
import { AILab } from './features/AILab';
import { cn } from './lib/utils';
import { 
  LayoutDashboard, 
  Search, 
  FlaskConical, 
  Menu, 
  ChevronRight,
  Database,
  BarChart3
} from 'lucide-react';
import { Separator } from './components/ui/separator';

const App = () => {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    console.log("RENDER_SUCCESS");
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Business metrics & charts' },
    { id: 'explorer', label: 'Review Explorer', icon: Database, description: 'Raw review data' },
    { id: 'lab', label: 'AI Lab', icon: FlaskConical, description: 'Test NLP model' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col border-r bg-card transition-all duration-300 z-50",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        <div className="p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white shrink-0">
            <BarChart3 className="h-5 w-5" />
          </div>
          {sidebarOpen && <span className="font-heading font-bold text-lg tracking-tight">SentimentAI</span>}
        </div>
        
        <Separator className="mx-4 w-auto" />
        
        <nav className="flex-1 p-2 space-y-1 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded px-3 py-2.5 transition-all group",
                activeView === item.id 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0",
                activeView === item.id ? "text-white" : "group-hover:text-blue-500"
              )} />
              {sidebarOpen && (
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded hover:bg-muted transition-colors"
          >
            {sidebarOpen ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span>Collapse</span>
              </div>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background Mesh */}
        <div className="absolute inset-0 bg-mesh opacity-[0.03] pointer-events-none" />

        {/* Header - Hero Background for Overview */}
        {activeView === 'overview' && (
          <div className="h-48 w-full relative shrink-0 overflow-hidden">
            <img 
              src="./assets/hero-workspace-1.jpg" 
              alt="Dashboard Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-6 left-8">
              <h1 className="text-3xl font-bold font-heading text-white drop-shadow-lg">Sentiment Analytics</h1>
              <p className="text-white/80 font-medium mt-1 drop-shadow-md">Insights from Amazon Fine Food Reviews</p>
            </div>
          </div>
        )}

        <div className={cn(
          "flex-1 overflow-y-auto p-8 relative",
          activeView !== 'overview' && "pt-6"
        )}>
          {activeView === 'overview' && <AnalysisDashboard />}
          {activeView === 'explorer' && <ReviewExplorer />}
          {activeView === 'lab' && <AILab />}
        </div>
      </main>
    </div>
  );
};

export default App;
