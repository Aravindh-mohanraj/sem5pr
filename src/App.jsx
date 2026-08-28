import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, BookOpen, PieChart, MessageSquare, LayoutDashboard, 
  Bell, ArrowUpRight, ArrowDownRight, Grid3X3, Settings, UserCircle,
  Database, Zap, Activity
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
  { id: 'showcase', label: 'Showcase', icon: Grid3X3 },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'watchlist', label: 'Alerts', icon: Bell },
  { id: 'portfolio', label: 'Portfolio', icon: PieChart },
  { id: 'chatbot', label: 'AI Chat', icon: MessageSquare },
  { id: 'learning', label: 'Learn', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: UserCircle },
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
  const gainers = [...stocks].sort((a, b) => (b.pct || 0) - (a.pct || 0)).slice(0, 1);
  const losers = [...stocks].sort((a, b) => (a.pct || 0) - (b.pct || 0)).slice(0, 1);

  const Idx = ({ label, price, pct }) => (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-gray-400 font-medium text-sm">{label}</span>
      <span className="font-mono font-semibold text-gray-900 text-sm">{price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
      <span className={`font-mono font-semibold text-sm flex items-center ${pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {pct >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}{pct >= 0 ? '+' : ''}{pct}%
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* ═══ TOP BAR ═══ */}
      <header className="bg-white border-b border-gray-200 px-5 lg:px-8 h-[60px] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/25">
              <TrendingUp size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-base text-gray-900 block leading-tight tracking-tight">AI Stock Analyzer</span>
              <span className="text-[10px] font-medium flex items-center gap-1 text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {dbOk ? 'SQLite Connected' : 'Live Engine'}
              </span>
            </div>
          </div>
          <div className="h-6 w-px bg-gray-200 shrink-0"></div>
          <Idx label="NIFTY" price={nifty.price} pct={nifty.pct} />
          <Idx label="NASDAQ" price={nasdaq.price} pct={nasdaq.pct} />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {triggered.length > 0 && (
            <button onClick={() => setTab('watchlist')} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-semibold animate-pulse">
              <Bell size={13} /> {triggered.length}
            </button>
          )}
          <button onClick={() => setTab('profile')} className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-violet-500/20">JD</div>
            <span className="text-sm font-semibold text-gray-900 hidden sm:block">Jai D.</span>
          </button>
        </div>
      </header>

      {/* ═══ NAV TABS ═══ */}
      <nav className="bg-white border-b border-gray-200 px-5 lg:px-8 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {TABS.map(t => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  on ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                <Icon size={16} strokeWidth={on ? 2.5 : 2} />
                {t.label}{t.id === 'dashboard' ? ` · ${stockId}` : ''}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ═══ STATS ROW (showcase only) ═══ */}
      {tab === 'showcase' && (
        <div className="px-5 lg:px-8 py-5 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-violet-600/15">
              <div className="flex items-center justify-between">
                <span className="text-violet-200 text-xs font-medium">Total Assets</span>
                <Database size={18} className="text-violet-300" />
              </div>
              <p className="text-3xl font-bold mt-2 tracking-tight">{stocks.length}</p>
              <p className="text-violet-200 text-xs mt-1">Real-time tracked</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">AI Buy Signals</span>
                <Zap size={18} className="text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{stocks.filter(s => s.aiSignal.includes('BUY')).length}</p>
              <p className="text-emerald-600 text-xs font-medium mt-1">FinBERT detected</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">Top Gainer</span>
                <ArrowUpRight size={18} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{gainers[0]?.id || '—'}</p>
              <p className="text-emerald-600 text-xs font-mono font-semibold mt-1">+{gainers[0]?.pct || 0}%</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">Top Loser</span>
                <ArrowDownRight size={18} className="text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{losers[0]?.id || '—'}</p>
              <p className="text-red-500 text-xs font-mono font-semibold mt-1">{losers[0]?.pct || 0}%</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONTENT ═══ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 lg:px-8 pb-8 pt-2">
        {tab === 'showcase' && <StockShowcase stocks={stocks} onSelectStock={setStockId} watchlist={watchlist} onToggleWatchlist={tog} onNavigateTab={setTab} />}
        {tab === 'dashboard' && <Dashboard stock={cur} stocksList={stocks} onSelectStock={setStockId} watchlist={watchlist} onToggleWatchlist={tog} />}
        {tab === 'watchlist' && <Watchlist stocks={stocks} watchlist={watchlist} onToggleWatchlist={tog} alerts={alerts} onAddAlert={addA} onSelectStock={id => { setStockId(id); setTab('dashboard'); }} />}
        {tab === 'portfolio' && <PortfolioOptimizer stocks={stocks} />}
        {tab === 'chatbot' && <Chatbot selectedStock={cur} />}
        {tab === 'learning' && <LearningCenter />}
        {tab === 'profile' && <UserProfile watchlist={watchlist} alerts={alerts} />}
        {tab === 'settings' && <SettingsPage />}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center">
        <p className="text-sm font-semibold text-gray-700">AI Stock Analyzer</p>
        <p className="text-xs text-gray-400 mt-0.5">React · Tailwind · FastAPI · SQLite · Recharts</p>
      </footer>
    </div>
  );
}

export default App;
