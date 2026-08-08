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
  Volume2
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Watchlist from './components/Watchlist';
import PortfolioOptimizer from './components/PortfolioOptimizer';
import Chatbot from './components/Chatbot';
import LearningCenter from './components/LearningCenter';
import { stocksList, stockHistories } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStockId, setSelectedStockId] = useState('TCS');
  const [watchlist, setWatchlist] = useState(['TCS', 'AAPL']);
  const [alerts, setAlerts] = useState([
    { id: 1, stockId: 'TCS', threshold: 3900, type: 'above', active: true },
    { id: 2, stockId: 'TSLA', threshold: 170, type: 'below', active: true }
  ]);
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [stocks, setStocks] = useState(stocksList);
  const [nifty, setNifty] = useState({ price: 22450.40, change: 112.50, pct: 0.50 });
  const [nasdaq, setNasdaq] = useState({ price: 16125.10, change: -45.80, pct: -0.28 });

  // Simulate real-time stock price fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate stocks
      setStocks(prevStocks => {
        return prevStocks.map(stock => {
          const changePercent = (Math.random() - 0.5) * 0.003; // max 0.15% change
          const newPrice = Number((stock.price * (1 + changePercent)).toFixed(2));
          const changeAmt = Number((newPrice - stock.prevClose).toFixed(2));
          const changePct = Number(((changeAmt / stock.prevClose) * 100).toFixed(2));
          
          // Check price alerts
          alerts.forEach(alert => {
            if (alert.stockId === stock.id && alert.active) {
              const condAbove = alert.type === 'above' && newPrice >= alert.threshold;
              const condBelow = alert.type === 'below' && newPrice <= alert.threshold;
              
              if (condAbove || condBelow) {
                // Trigger alert
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

      // Fluctuate indices
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
    // Disable alert so it only fires once
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
    
    // Web Audio alert sound effect
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
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

  const handleClearTriggeredAlerts = () => {
    setTriggeredAlerts([]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/10">
              <TrendingUp size={22} className="text-slate-950" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Antigravity
              </h1>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles size={10} /> AI Stock Mentor
              </span>
            </div>
          </div>
          
          <nav className="px-4 space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'dashboard' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-3' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Market Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('watchlist')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'watchlist' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-3' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Bookmark size={18} />
              <span>Watchlist & Alerts</span>
            </button>
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'portfolio' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-3' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <PieChart size={18} />
              <span>Portfolio Optimizer</span>
            </button>
            <button 
              onClick={() => setActiveTab('chatbot')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'chatbot' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-3' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <MessageSquare size={18} />
              <span>AI Chatbot Mentor</span>
            </button>
            <button 
              onClick={() => setActiveTab('learning')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === 'learning' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 pl-3' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <BookOpen size={18} />
              <span>Learning Center</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          {triggeredAlerts.length > 0 && (
            <div className="mb-3 p-3 bg-red-950/40 border border-red-500/30 rounded-xl">
              <div className="flex items-center justify-between text-xs text-red-400 font-bold mb-1">
                <span className="flex items-center gap-1"><Bell size={12} className="animate-bounce" /> Alert Triggered!</span>
                <button onClick={handleClearTriggeredAlerts} className="hover:underline">Clear</button>
              </div>
              <p className="text-[11px] text-slate-300">
                {triggeredAlerts[0].stockId} reached {triggeredAlerts[0].type === 'above' ? '≥' : '≤'} ₹{triggeredAlerts[0].threshold} (Current: ₹{triggeredAlerts[0].price})
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <User size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Guest Investor</h4>
              <span className="text-[10px] text-slate-500">Tier: Newbie Investor</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        
        {/* Top Ticker & Index Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/40 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
            
            {/* Nifty 50 */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-slate-400 text-xs tracking-wider">NIFTY 50</span>
              <span className="font-mono font-bold">{nifty.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              <span className={`flex items-center font-mono text-xs ${nifty.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {nifty.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {nifty.change >= 0 ? '+' : ''}{nifty.pct}%
              </span>
            </div>

            {/* NASDAQ */}
            <div className="flex items-center gap-2 text-sm border-l border-slate-800 pl-6">
              <span className="font-semibold text-slate-400 text-xs tracking-wider">NASDAQ</span>
              <span className="font-mono font-bold">{nasdaq.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
              <span className={`flex items-center font-mono text-xs ${nasdaq.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {nasdaq.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {nasdaq.change >= 0 ? '+' : ''}{nasdaq.pct}%
              </span>
            </div>

            {/* Simulated Live Tickers of our selected Stocks */}
            <div className="flex items-center gap-4 border-l border-slate-800 pl-6 text-xs select-none">
              {stocks.map(s => {
                const isPositive = s.change >= 0;
                return (
                  <button 
                    key={s.id}
                    onClick={() => {
                      setSelectedStockId(s.id);
                      setActiveTab('dashboard');
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                      s.id === selectedStockId 
                        ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 text-slate-300'
                    }`}
                  >
                    <span className="font-bold">{s.id}</span>
                    <span className="font-mono">₹{s.price.toFixed(1)}</span>
                    <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
                      {isPositive ? '+' : ''}{s.pct}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Settings / Notifications */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setActiveTab('watchlist')}
                className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Bell size={18} />
                {alerts.some(a => a.active) && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 pulse-glow-green"></span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Tab View Contents */}
        <div className="flex-1 overflow-y-auto p-8">
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
        </div>
      </main>

    </div>
  );
}

export default App;
