import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, BookOpen, PieChart, MessageSquare, LayoutDashboard, 
  Bell, ArrowUpRight, ArrowDownRight, Grid3X3, Settings, UserCircle,
  Database, Search, ChevronRight, Zap, BarChart3, Activity, Globe,
  Layers, Menu, X
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

const NAV = [
  { id: 'showcase', label: 'Stock Showcase', icon: Grid3X3 },
  { id: 'dashboard', label: 'Live Dashboard', icon: LayoutDashboard },
  { id: 'watchlist', label: 'Alerts & Watchlist', icon: Bell },
  { id: 'portfolio', label: 'Portfolio Optimizer', icon: PieChart },
  { id: 'chatbot', label: 'AI Chatbot', icon: MessageSquare },
  { id: 'learning', label: 'Learning Hub', icon: BookOpen },
];

const NAV_BOTTOM = [
  { id: 'profile', label: 'My Profile', icon: UserCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function App() {
  const [tab, setTab] = useState('showcase');
  const [stockId, setStockId] = useState('TCS');
  const [watchlist, setWatchlist] = useState(['TCS', 'AAPL', 'NVDA']);
  const [alerts, setAlerts] = useState([
    { id: 1, stockId: 'TCS', threshold: 3900, type: 'above', active: true },
    { id: 2, stockId: 'TSLA', threshold: 170, type: 'below', active: true },
    { id: 3, stockId: 'NVDA', threshold: 130, type: 'above', active: true }
  ]);
  const [triggered, setTriggered] = useState([]);
  const [stocks, setStocks] = useState(stocksList);
  const [dbOk, setDbOk] = useState(false);
  const [nifty, setNifty] = useState({ price: 22450.4, pct: 0.5 });
  const [nasdaq, setNasdaq] = useState({ price: 16125.1, pct: -0.28 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stocks').then(r => r.json()).then(data => {
      if (Array.isArray(data) && data.length) {
        setStocks(data.map(s => ({
          id: s.id, name: s.name, ticker: s.ticker, sector: s.sector,
          price: s.price, prevClose: s.prev_close, volume: s.volume,
          marketCap: s.market_cap, esgScore: s.esg_score, country: s.country,
          popular: true, aiSignal: s.ai_signal, peRatio: s.pe_ratio,
          eps: s.eps, beta: s.beta, divYield: s.div_yield,
          high52w: s.high_52w, low52w: s.low_52w,
          targetPrice: s.target_price, recommendationScore: s.recommendation_score
        })));
        setDbOk(true);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setStocks(p => p.map(s => {
        const d = (Math.random() - 0.49) * 0.004;
        const pr = +(s.price * (1 + d)).toFixed(2);
        const ch = +(pr - s.prevClose).toFixed(2);
        const pct = +((ch / s.prevClose) * 100).toFixed(2);
        alerts.forEach(a => {
          if (a.stockId === s.id && a.active &&
            ((a.type === 'above' && pr >= a.threshold) || (a.type === 'below' && pr <= a.threshold)))
            fire(s.id, pr, a);
        });
        return { ...s, price: pr, change: ch, pct };
      }));
      setNifty(p => { const v = +(p.price + (Math.random() - 0.48) * 15).toFixed(2); return { price: v, pct: +(((v - 22337.9) / 22337.9) * 100).toFixed(2) }; });
      setNasdaq(p => { const v = +(p.price + (Math.random() - 0.52) * 20).toFixed(2); return { price: v, pct: +(((v - 16170.9) / 16170.9) * 100).toFixed(2) }; });
    }, 3000);
    return () => clearInterval(iv);
  }, [alerts]);

  const fire = (id, price, alert) => {
    setAlerts(p => p.map(a => a.id === alert.id ? { ...a, active: false } : a));
    setTriggered(p => [{ id: Date.now(), stockId: id, price, threshold: alert.threshold, type: alert.type, time: new Date().toLocaleTimeString() }, ...p]);
    try { const c = new AudioContext(); const o = c.createOscillator(); const g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = 0.1; o.start(); o.stop(c.currentTime + 0.3); } catch (_) {}
  };

  const cur = stocks.find(s => s.id === stockId) || stocks[0];
  const tog = id => setWatchlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const addA = a => setAlerts(p => [...p, { ...a, id: Date.now(), active: true }]);

  // Top gainers & losers
  const gainers = [...stocks].sort((a, b) => (b.pct || 0) - (a.pct || 0)).slice(0, 3);
  const losers = [...stocks].sort((a, b) => (a.pct || 0) - (b.pct || 0)).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* ══════ SIDEBAR ══════ */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col transition-transform lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Header */}
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <TrendingUp size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-[15px] font-bold tracking-tight">AI Stock Analyzer</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] text-gray-400 font-medium">{dbOk ? 'SQLite Connected' : 'Live Engine'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold px-3 pt-2 pb-1">Analytics</p>
          {NAV.map(n => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => { setTab(n.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  active 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                <span>{n.label}</span>
                {n.id === 'watchlist' && triggered.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">{triggered.length}</span>
                )}
              </button>
            );
          })}

          <div className="my-3 border-t border-white/10"></div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold px-3 pt-1 pb-1">Account</p>
          {NAV_BOTTOM.map(n => {
            const Icon = n.icon;
            return (
              <button key={n.id} onClick={() => { setTab(n.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  tab === n.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <Icon size={18} strokeWidth={tab === n.id ? 2.5 : 1.8} />
                <span>{n.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-[12px] font-bold flex items-center justify-center shadow-md">JD</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">Jai D.</p>
              <p className="text-[11px] text-gray-500">Pro Investor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* ══════ MAIN AREA ══════ */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-14 px-4 lg:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-4 text-[13px] overflow-x-auto no-scrollbar">
              {[{ l: 'NIFTY 50', ...nifty }, { l: 'NASDAQ', ...nasdaq }].map(idx => (
                <div key={idx.l} className="flex items-center gap-2 shrink-0">
                  <span className="text-gray-400 font-medium">{idx.l}</span>
                  <span className="font-mono font-semibold text-gray-900">{idx.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  <span className={`font-mono font-semibold flex items-center ${idx.pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {idx.pct >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {idx.pct >= 0 ? '+' : ''}{idx.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick ticker pills */}
            <div className="hidden lg:flex items-center gap-1.5">
              {stocks.slice(0, 4).map(s => (
                <button key={s.id} onClick={() => { setStockId(s.id); setTab('dashboard'); }}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium border ${s.id === stockId ? 'border-violet-300 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  {s.id} <span className="font-mono">{s.country === 'US' ? '$' : '₹'}{s.price.toFixed(0)}</span>
                </button>
              ))}
            </div>
            {triggered.length > 0 && (
              <button onClick={() => setTab('watchlist')} className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-[11px] font-semibold animate-pulse">
                <Bell size={12} /> {triggered.length}
              </button>
            )}
          </div>
        </header>

        {/* ──── DASHBOARD STATS ROW (only on showcase) ──── */}
        {tab === 'showcase' && (
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-4 text-white shadow-lg shadow-violet-600/20">
                <div className="flex items-center justify-between">
                  <span className="text-violet-200 text-[12px] font-medium">Total Assets</span>
                  <Database size={18} className="text-violet-300" />
                </div>
                <p className="text-2xl font-bold mt-1">{stocks.length}</p>
                <p className="text-violet-200 text-[11px] mt-0.5">Across {new Set(stocks.map(s => s.country)).size} markets</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-[12px] font-medium">Buy Signals</span>
                  <Zap size={18} className="text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stocks.filter(s => s.aiSignal.includes('BUY')).length}</p>
                <p className="text-emerald-600 text-[11px] font-medium mt-0.5">FinBERT AI detected</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-[12px] font-medium">Top Gainer</span>
                  <ArrowUpRight size={18} className="text-emerald-500" />
                </div>
                <p className="text-xl font-bold text-gray-900 mt-1">{gainers[0]?.id || '—'}</p>
                <p className="text-emerald-600 text-[11px] font-mono font-semibold mt-0.5">+{gainers[0]?.pct || 0}% today</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-[12px] font-medium">Top Loser</span>
                  <ArrowDownRight size={18} className="text-red-500" />
                </div>
                <p className="text-xl font-bold text-gray-900 mt-1">{losers[0]?.id || '—'}</p>
                <p className="text-red-500 text-[11px] font-mono font-semibold mt-0.5">{losers[0]?.pct || 0}% today</p>
              </div>
            </div>
          </div>
        )}

        {/* ──── CONTENT ──── */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {tab === 'showcase' && <StockShowcase stocks={stocks} onSelectStock={setStockId} watchlist={watchlist} onToggleWatchlist={tog} onNavigateTab={setTab} />}
          {tab === 'dashboard' && <Dashboard stock={cur} stocksList={stocks} onSelectStock={setStockId} watchlist={watchlist} onToggleWatchlist={tog} />}
          {tab === 'watchlist' && <Watchlist stocks={stocks} watchlist={watchlist} onToggleWatchlist={tog} alerts={alerts} onAddAlert={addA} onSelectStock={id => { setStockId(id); setTab('dashboard'); }} />}
          {tab === 'portfolio' && <PortfolioOptimizer stocks={stocks} />}
          {tab === 'chatbot' && <Chatbot selectedStock={cur} />}
          {tab === 'learning' && <LearningCenter />}
          {tab === 'profile' && <UserProfile watchlist={watchlist} alerts={alerts} />}
          {tab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
