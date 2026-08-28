import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, BookOpen, PieChart, MessageSquare, LayoutDashboard, 
  Bell, ArrowUpRight, ArrowDownRight, Grid, Settings, UserCircle,
  Database, ChevronRight
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Watchlist from './components/Watchlist';
import PortfolioOptimizer from './components/PortfolioOptimizer';
import Chatbot from './components/Chatbot';
import LearningCenter from './components/LearningCenter';
import StockShowcase from './components/StockShowcase';
import UserProfile from './components/UserProfile';
import SettingsPage from './components/SettingsPage';
import { stocksList } from './data/mockData';

const TABS = [
  { id: 'showcase', label: 'Showcase', icon: Grid },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, showStock: true },
  { id: 'watchlist', label: 'Watchlist & Alerts', icon: Bell },
  { id: 'portfolio', label: 'Portfolio', icon: PieChart },
  { id: 'chatbot', label: 'AI Chatbot', icon: MessageSquare },
  { id: 'learning', label: 'Learn', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function App() {
  const [activeTab, setActiveTab] = useState('showcase');
  const [selectedStockId, setSelectedStockId] = useState('TCS');
  const [watchlist, setWatchlist] = useState(['TCS', 'AAPL', 'NVDA']);
  const [alerts, setAlerts] = useState([
    { id: 1, stockId: 'TCS', threshold: 3900, type: 'above', active: true },
    { id: 2, stockId: 'TSLA', threshold: 170, type: 'below', active: true },
    { id: 3, stockId: 'NVDA', threshold: 130, type: 'above', active: true }
  ]);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [stocks, setStocks] = useState(stocksList);
  const [dbConnected, setDbConnected] = useState(false);
  const [nifty, setNifty] = useState({ price: 22450.40, pct: 0.50 });
  const [nasdaq, setNasdaq] = useState({ price: 16125.10, pct: -0.28 });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/stocks');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setStocks(data.map(s => ({
              id: s.id, name: s.name, ticker: s.ticker, sector: s.sector,
              price: s.price, prevClose: s.prev_close, volume: s.volume,
              marketCap: s.market_cap, esgScore: s.esg_score, country: s.country,
              popular: true, aiSignal: s.ai_signal, peRatio: s.pe_ratio,
              eps: s.eps, beta: s.beta, divYield: s.div_yield,
              high52w: s.high_52w, low52w: s.low_52w,
              targetPrice: s.target_price, recommendationScore: s.recommendation_score
            })));
            setDbConnected(true);
          }
        }
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const d = (Math.random() - 0.49) * 0.004;
        const p = +(stock.price * (1 + d)).toFixed(2);
        const c = +(p - stock.prevClose).toFixed(2);
        const pct = +((c / stock.prevClose) * 100).toFixed(2);
        alerts.forEach(a => {
          if (a.stockId === stock.id && a.active) {
            if ((a.type === 'above' && p >= a.threshold) || (a.type === 'below' && p <= a.threshold))
              triggerAlert(stock.id, p, a);
          }
        });
        return { ...stock, price: p, change: c, pct };
      }));
      setNifty(prev => {
        const p = +(prev.price + (Math.random() - 0.48) * 15).toFixed(2);
        return { price: p, pct: +(((p - 22337.9) / 22337.9) * 100).toFixed(2) };
      });
      setNasdaq(prev => {
        const p = +(prev.price + (Math.random() - 0.52) * 20).toFixed(2);
        return { price: p, pct: +(((p - 16170.9) / 16170.9) * 100).toFixed(2) };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [alerts]);

  const triggerAlert = (stockId, price, alert) => {
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, active: false } : a));
    setTriggeredAlerts(prev => [{ id: Date.now(), stockId, price, threshold: alert.threshold, type: alert.type, time: new Date().toLocaleTimeString() }, ...prev]);
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(); const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } catch (_) {}
  };

  const currentStock = stocks.find(s => s.id === selectedStockId) || stocks[0];
  const toggleWatchlist = id => setWatchlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const addAlert = a => setAlerts(prev => [...prev, { ...a, id: Date.now(), active: true }]);

  const IndexPill = ({ label, price, pct }) => (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 font-medium text-[13px]">{label}</span>
      <span className="font-mono font-semibold text-gray-800 text-[13px]">{price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
      <span className={`flex items-center gap-0.5 font-mono font-semibold text-[13px] ${pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {pct >= 0 ? <ArrowUpRight size={14} strokeWidth={2.5} /> : <ArrowDownRight size={14} strokeWidth={2.5} />}
        {pct >= 0 ? '+' : ''}{pct}%
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      
      {/* ─── TOP BAR ─── */}
      <header className="bg-white border-b border-gray-200 px-6 lg:px-8 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <TrendingUp size={18} strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <span className="font-semibold text-[15px] text-gray-900 block">AI Stock Analyzer</span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                {dbConnected ? 'SQLite Connected' : 'Live Simulation'}
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-gray-200 shrink-0"></div>

          {/* Market Indices */}
          <IndexPill label="NIFTY 50" price={nifty.price} pct={nifty.pct} />
          <IndexPill label="NASDAQ" price={nasdaq.price} pct={nasdaq.pct} />

          {/* Quick Ticker Strip */}
          <div className="hidden xl:flex items-center gap-1.5 pl-4 border-l border-gray-200">
            {stocks.slice(0, 5).map(s => (
              <button 
                key={s.id}
                onClick={() => { setSelectedStockId(s.id); setActiveTab('dashboard'); }}
                className={`px-2.5 py-1 rounded-md text-[12px] font-medium border transition-colors ${
                  s.id === selectedStockId 
                    ? 'border-blue-200 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="font-semibold">{s.id}</span>{' '}
                <span className="font-mono">{s.country === 'US' ? '$' : '₹'}{s.price.toFixed(0)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Alerts + User */}
        <div className="flex items-center gap-3 shrink-0">
          {triggeredAlerts.length > 0 && (
            <button onClick={() => setActiveTab('watchlist')} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-full text-[12px] font-semibold">
              <Bell size={13} /> {triggeredAlerts.length} Alert{triggeredAlerts.length > 1 ? 's' : ''}
            </button>
          )}
          <button onClick={() => setActiveTab('profile')} className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-[12px] font-bold flex items-center justify-center shadow-sm">AM</div>
            <div className="hidden sm:block">
              <span className="text-[13px] font-semibold text-gray-900 block leading-tight">Aravindh M.</span>
              <span className="text-[10px] text-gray-500 font-medium">Pro Investor</span>
            </div>
          </button>
        </div>
      </header>

      {/* ─── HERO BANNER ─── */}
      <div className="bg-gray-900 text-white px-6 lg:px-8 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-indigo-900/30 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Stock Intelligence Platform</h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
            Real-time market analytics powered by FinBERT sentiment analysis, technical indicators, and Modern Portfolio Theory.
          </p>
          <div className="flex items-center justify-center gap-6 pt-3 text-[13px] text-gray-400">
            <span className="flex items-center gap-1.5"><Database size={14} className="text-blue-400" /> {stocks.length} Assets Tracked</span>
            <span>•</span>
            <span>98.4% FinBERT Accuracy</span>
            <span>•</span>
            <span>3s Real-Time Updates</span>
          </div>
        </div>
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav className="bg-white border-b border-gray-200 px-6 lg:px-8 sticky top-0 z-30 shadow-nav">
        <div className="max-w-6xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                <span>{tab.label}{tab.showStock ? ` (${selectedStockId})` : ''}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── CONTENT ─── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-8 py-6">
        {activeTab === 'showcase' && <StockShowcase stocks={stocks} onSelectStock={setSelectedStockId} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} onNavigateTab={setActiveTab} />}
        {activeTab === 'dashboard' && <Dashboard stock={currentStock} stocksList={stocks} onSelectStock={setSelectedStockId} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} />}
        {activeTab === 'watchlist' && <Watchlist stocks={stocks} watchlist={watchlist} onToggleWatchlist={toggleWatchlist} alerts={alerts} onAddAlert={addAlert} onSelectStock={id => { setSelectedStockId(id); setActiveTab('dashboard'); }} />}
        {activeTab === 'portfolio' && <PortfolioOptimizer stocks={stocks} />}
        {activeTab === 'chatbot' && <Chatbot selectedStock={currentStock} />}
        {activeTab === 'learning' && <LearningCenter />}
        {activeTab === 'profile' && <UserProfile watchlist={watchlist} alerts={alerts} />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-gray-200 py-5 px-6 text-center space-y-1">
        <p className="text-[13px] font-semibold text-gray-700">AI Stock Analyzer — Financial Intelligence Platform</p>
        <p className="text-[11px] text-gray-400">React • Tailwind CSS • FastAPI • SQLite • Recharts • Web Speech API</p>
      </footer>
    </div>
  );
}

export default App;
