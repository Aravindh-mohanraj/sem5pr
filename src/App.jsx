import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  PieChart, 
  MessageSquare, 
  Bookmark, 
  LayoutDashboard, 
  Bell, 
  User, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  Grid,
  Search,
  Shield,
  Layers,
  Zap,
  Globe,
  Settings,
  UserCheck,
  Activity,
  Award
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

function App() {
  const [activeTab, setActiveTab] = useState('showcase'); // 'showcase', 'dashboard', 'watchlist', 'portfolio', 'chatbot', 'learning', 'profile', 'settings'
  const [selectedStockId, setSelectedStockId] = useState('TCS');
  const [watchlist, setWatchlist] = useState(['TCS', 'AAPL', 'NVDA']);
  const [alerts, setAlerts] = useState([
    { id: 1, stockId: 'TCS', threshold: 3900, type: 'above', active: true },
    { id: 2, stockId: 'TSLA', threshold: 170, type: 'below', active: true },
    { id: 3, stockId: 'NVDA', threshold: 130, type: 'above', active: true }
  ]);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [stocks, setStocks] = useState(stocksList);
  const [nifty, setNifty] = useState({ price: 22450.40, change: 112.50, pct: 0.50 });
  const [nasdaq, setNasdaq] = useState({ price: 16125.10, change: -45.80, pct: -0.28 });

  // Real-time stock price fluctuations simulation engine
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => {
        return prevStocks.map(stock => {
          const changePercent = (Math.random() - 0.49) * 0.004;
          const newPrice = Number((stock.price * (1 + changePercent)).toFixed(2));
          const changeAmt = Number((newPrice - stock.prevClose).toFixed(2));
          const changePct = Number(((changeAmt / stock.prevClose) * 100).toFixed(2));
          
          alerts.forEach(alert => {
            if (alert.stockId === stock.id && alert.active) {
              const condAbove = alert.type === 'above' && newPrice >= alert.threshold;
              const condBelow = alert.type === 'below' && newPrice <= alert.threshold;
              
              if (condAbove || condBelow) {
                triggerAlert(stock.id, newPrice, alert);
              }
            }
          });

          return {
            ...stock,
            price: newPrice,
            change: changeAmt,
            pct: changePct
          };
        });
      });

      setNifty(prev => {
        const change = (Math.random() - 0.48) * 15;
        const newPrice = Number((prev.price + change).toFixed(2));
        const diff = Number((newPrice - 22337.90).toFixed(2));
        return { price: newPrice, change: diff, pct: Number(((diff / 22337.90) * 100).toFixed(2)) };
      });

      setNasdaq(prev => {
        const change = (Math.random() - 0.52) * 20;
        const newPrice = Number((prev.price + change).toFixed(2));
        const diff = Number((newPrice - 16170.90).toFixed(2));
        return { price: newPrice, change: diff, pct: Number(((diff / 16170.90) * 100).toFixed(2)) };
      });

    }, 3000);

    return () => clearInterval(interval);
  }, [alerts]);

  const triggerAlert = (stockId, price, alert) => {
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, active: false } : a));
    
    const timeStr = new Date().toLocaleTimeString();
    const newTrigger = {
      id: Date.now(),
      stockId,
      price,
      threshold: alert.threshold,
      type: alert.type,
      time: timeStr
    };
    
    setTriggeredAlerts(prev => [newTrigger, ...prev]);
    
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.log('Audio Context blocked or not supported');
    }
  };

  const currentStock = stocks.find(s => s.id === selectedStockId) || stocks[0];

  const handleToggleWatchlist = (stockId) => {
    if (watchlist.includes(stockId)) {
      setWatchlist(prev => prev.filter(id => id !== stockId));
    } else {
      setWatchlist(prev => [...prev, stockId]);
    }
  };

  const handleAddAlert = (alert) => {
    setAlerts(prev => [...prev, { ...alert, id: Date.now(), active: true }]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-sky-500/20 selection:text-sky-700">
      
      {/* 1. INSTITUTIONAL TICKER BAR */}
      <header className="bg-white border-b border-slate-200/90 px-4 lg:px-8 py-2.5 flex items-center justify-between text-xs shrink-0 shadow-2xs">
        
        {/* Brand & Market Status */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-black shadow-md shadow-sky-600/20">
              <TrendingUp size={18} />
            </div>
            <div>
              <span className="font-display font-extrabold text-base text-slate-900 tracking-tight block leading-none">AI Stock Analyzer</span>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> MARKET LIVE • REAL-TIME DATA
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* NIFTY 50 */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 tracking-wider">NIFTY 50</span>
            <span className="font-mono font-bold text-slate-900">{nifty.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            <span className={`flex items-center font-mono font-bold ${nifty.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {nifty.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {nifty.change >= 0 ? '+' : ''}{nifty.pct}%
            </span>
          </div>

          {/* NASDAQ */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <span className="font-semibold text-slate-500 tracking-wider">NASDAQ</span>
            <span className="font-mono font-bold text-slate-900">{nasdaq.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
            <span className={`flex items-center font-mono font-bold ${nasdaq.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {nasdaq.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {nasdaq.change >= 0 ? '+' : ''}{nasdaq.pct}%
            </span>
          </div>

          {/* Live Ticker Switcher */}
          <div className="hidden xl:flex items-center gap-2 border-l border-slate-200 pl-4 select-none">
            {stocks.slice(0, 6).map(s => (
              <button 
                key={s.id}
                onClick={() => {
                  setSelectedStockId(s.id);
                  setActiveTab('dashboard');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border transition-all ${
                  s.id === selectedStockId 
                    ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold shadow-2xs' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-600'
                }`}
              >
                <span>{s.id}</span>
                <span className="font-mono font-bold">{s.country === 'US' ? '$' : '₹'}{s.price.toFixed(1)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile Trigger & Notifications */}
        <div className="flex items-center gap-3">
          {triggeredAlerts.length > 0 && (
            <button 
              onClick={() => setActiveTab('watchlist')}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-full font-semibold animate-pulse"
            >
              <Bell size={12} />
              <span>{triggeredAlerts.length} Alert Triggered</span>
            </button>
          )}

          <button 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-3 border-l border-slate-200 hover:text-sky-600 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              JD
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">Jai D.</span>
              <span className="text-[9px] text-sky-700 font-bold block">Pro Tier</span>
            </div>
          </button>
        </div>

      </header>

      {/* 2. ENTERPRISE HERO BANNER */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 text-white px-6 lg:px-12 py-10 shadow-lg relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <div className="text-center space-y-2">
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight drop-shadow-sm">
              Themes
            </h1>
            <p className="text-sm sm:text-base text-sky-100 max-w-2xl mx-auto font-normal leading-relaxed opacity-95">
              Add intelligence to your stock portfolio with 1000+ AI models, real-time analytics & explainable recommendations.
            </p>
          </div>

          {/* Quick Institutional Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2 text-center text-xs">
            <div className="p-2.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl">
              <span className="text-[10px] text-sky-200 uppercase font-bold tracking-wider block">AI Assets Tracked</span>
              <span className="font-mono font-extrabold text-white text-base">8 Institutional</span>
            </div>
            <div className="p-2.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl">
              <span className="text-[10px] text-sky-200 uppercase font-bold tracking-wider block">FinBERT Accuracy</span>
              <span className="font-mono font-extrabold text-white text-base">98.4% Confidence</span>
            </div>
            <div className="p-2.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl">
              <span className="text-[10px] text-sky-200 uppercase font-bold tracking-wider block">MPT Risk Frontier</span>
              <span className="font-mono font-extrabold text-white text-base">Monte Carlo 2k</span>
            </div>
            <div className="p-2.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl">
              <span className="text-[10px] text-sky-200 uppercase font-bold tracking-wider block">Latency Engine</span>
              <span className="font-mono font-extrabold text-white text-base">3000ms Interval</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TAB STRIP */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-12 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
          
          <button 
            onClick={() => setActiveTab('showcase')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === 'showcase' 
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Grid size={15} />
            <span>Directory Showcase</span>
          </button>

          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === 'dashboard' 
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard size={15} />
            <span>Market Dashboard ({selectedStockId})</span>
          </button>

          <button 
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === 'watchlist' 
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell size={15} />
            <span>Alerts & Watchlist ({watchlist.length})</span>
          </button>

          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === 'portfolio' 
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PieChart size={15} />
            <span>Portfolio Optimizer</span>
          </button>

          <button 
            onClick={() => setActiveTab('chatbot')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === 'chatbot' 
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare size={15} />
            <span>AI Chatbot Mentor</span>
          </button>

          <button 
            onClick={() => setActiveTab('learning')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === 'learning' 
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={15} />
            <span>Learning Center</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1"></div>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === 'profile' 
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck size={15} />
            <span>User Profile</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-xs transition-all whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings size={15} />
            <span>Settings</span>
          </button>

        </div>
      </div>

      {/* 4. MAIN VIEW CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {activeTab === 'showcase' && (
          <StockShowcase 
            stocks={stocks}
            onSelectStock={setSelectedStockId}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            stock={currentStock} 
            stocksList={stocks} 
            onSelectStock={setSelectedStockId} 
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}

        {activeTab === 'watchlist' && (
          <Watchlist 
            stocks={stocks} 
            watchlist={watchlist} 
            onToggleWatchlist={handleToggleWatchlist}
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onSelectStock={(id) => { setSelectedStockId(id); setActiveTab('dashboard'); }}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioOptimizer 
            stocks={stocks}
          />
        )}

        {activeTab === 'chatbot' && (
          <Chatbot 
            selectedStock={currentStock}
          />
        )}

        {activeTab === 'learning' && (
          <LearningCenter />
        )}

        {activeTab === 'profile' && (
          <UserProfile 
            watchlist={watchlist}
            alerts={alerts}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage />
        )}

      </main>

      {/* 5. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <p className="font-semibold text-slate-700">AI Stock Analyzer • Institutional Financial Intelligence Platform</p>
        <p className="text-[11px] text-slate-500 max-w-2xl mx-auto">
          Client-side financial engine. Built with React, Tailwind CSS, Recharts, and Web Speech API.
        </p>
      </footer>

    </div>
  );
}

export default App;
