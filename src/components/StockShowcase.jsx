import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, Bookmark, BookmarkCheck, ArrowUpRight, ArrowDownRight, MessageSquare, BarChart2, ShieldCheck, Zap, Globe, LayoutGrid, List, Activity } from 'lucide-react';
import { getTechnicalIndicators, esgBreakdown } from '../data/mockData';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'buy', label: 'Buy Signals', icon: Sparkles },
  { id: 'gainers', label: 'Gainers', icon: TrendingUp },
  { id: 'esg', label: 'High ESG', icon: ShieldCheck },
  { id: 'tech', label: 'Tech', icon: Zap },
  { id: 'us', label: 'US', icon: Globe },
  { id: 'watchlist', label: 'Saved', icon: Bookmark },
];

export default function StockShowcase({ stocks, onSelectStock, watchlist, onToggleWatchlist, onNavigateTab }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');

  const list = stocks.filter(s => {
    const m = q.toLowerCase();
    if (m && !s.name.toLowerCase().includes(m) && !s.id.toLowerCase().includes(m) && !s.sector.toLowerCase().includes(m)) return false;
    if (filter === 'buy') return s.aiSignal.includes('BUY');
    if (filter === 'gainers') return s.change >= 0;
    if (filter === 'esg') return s.esgScore >= 80;
    if (filter === 'tech') return /technology|semiconductors|software/i.test(s.sector);
    if (filter === 'us') return s.country === 'US';
    if (filter === 'watchlist') return watchlist.includes(s.id);
    return true;
  });

  const badge = sig => {
    if (sig.includes('BUY')) return 'bg-emerald-100 text-emerald-700';
    if (sig === 'UNDERPERFORM' || sig === 'SELL') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="space-y-4">
      
      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search stocks..."
            className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 placeholder:text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-200/60 p-0.5 rounded-lg">
            <button onClick={() => setView('grid')} className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${view === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}><LayoutGrid size={14} /> Grid</button>
            <button onClick={() => setView('table')} className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 ${view === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}><List size={14} /> Table</button>
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
              filter === f.id ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
            }`}>
            {f.icon && <f.icon size={12} />} {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
          <p className="text-lg font-semibold text-gray-800">No matches found</p>
          <p className="text-sm text-gray-500 mt-1">Try a different search term or filter.</p>
          <button onClick={() => { setQ(''); setFilter('all'); }} className="mt-4 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 shadow-md shadow-violet-600/20">Clear Filters</button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map(s => {
            const up = s.change >= 0;
            const ind = getTechnicalIndicators(s.id);
            const esg = esgBreakdown[s.id] || { grade: 'A' };
            const saved = watchlist.includes(s.id);
            return (
              <div key={s.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-violet-300 transition-all group">
                
                {/* Card Top: Ticker + Price */}
                <div className="p-5 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gray-900 text-white flex items-center justify-center text-sm font-bold tracking-tight shadow-md">
                        {s.id.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-violet-700 transition-colors">{s.id}</h3>
                          <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">{s.country}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.name}</p>
                      </div>
                    </div>
                    <button onClick={() => onToggleWatchlist(s.id)} className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-500 hover:bg-amber-50'}`}>
                      {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>

                  {/* Price + Change */}
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Market Price</p>
                      <p className="font-mono text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
                        {s.country === 'US' ? '$' : '₹'}{s.price.toLocaleString(s.country === 'US' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1 font-mono text-sm font-bold px-2.5 py-1 rounded-lg ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {up ? '+' : ''}{s.pct}%
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 mx-5"></div>

                {/* Metrics Grid */}
                <div className="p-5 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">AI Signal</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${badge(s.aiSignal)}`}>{s.aiSignal}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { l: 'P/E', v: `${s.peRatio}x` },
                      { l: 'RSI', v: ind.rsi },
                      { l: 'ESG', v: `${s.esgScore}` },
                      { l: 'Beta', v: s.beta },
                    ].map(m => (
                      <div key={m.l} className="bg-gray-50 rounded-lg py-2">
                        <p className="text-[10px] text-gray-400 font-medium">{m.l}</p>
                        <p className="font-mono text-sm font-semibold text-gray-800 mt-0.5">{m.v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button onClick={() => { onSelectStock(s.id); onNavigateTab('dashboard'); }}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all">
                      <BarChart2 size={14} /> Analyze
                    </button>
                    <button onClick={() => { onSelectStock(s.id); onNavigateTab('chatbot'); }}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all border border-gray-200">
                      <MessageSquare size={14} /> Ask AI
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE */
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Change</th>
                <th className="py-3 px-4 text-center">AI Signal</th>
                <th className="py-3 px-4 text-right">P/E</th>
                <th className="py-3 px-4 text-center">ESG</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map(s => {
                const up = s.change >= 0;
                const saved = watchlist.includes(s.id);
                return (
                  <tr key={s.id} className="hover:bg-violet-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => onToggleWatchlist(s.id)} className={saved ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'}>{saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}</button>
                        <div className="h-8 w-8 rounded-lg bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">{s.id.slice(0, 3)}</div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{s.id}</p>
                          <p className="text-[11px] text-gray-500 line-clamp-1">{s.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">{s.sector}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-gray-900">{s.country === 'US' ? '$' : '₹'}{s.price.toFixed(2)}</td>
                    <td className={`py-3.5 px-4 text-right font-mono font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>{up ? '+' : ''}{s.pct}%</td>
                    <td className="py-3.5 px-4 text-center"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge(s.aiSignal)}`}>{s.aiSignal}</span></td>
                    <td className="py-3.5 px-4 text-right font-mono text-gray-600">{s.peRatio}x</td>
                    <td className="py-3.5 px-4 text-center font-mono text-gray-600">{s.esgScore}</td>
                    <td className="py-3.5 px-4">
                      <button onClick={() => { onSelectStock(s.id); onNavigateTab('dashboard'); }}
                        className="px-3 py-1.5 bg-violet-600 text-white text-[11px] font-semibold rounded-lg hover:bg-violet-700 shadow-sm">
                        Analyze →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
