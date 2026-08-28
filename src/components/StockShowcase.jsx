import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, Bookmark, BookmarkCheck, ArrowUpRight, ArrowDownRight, MessageSquare, BarChart2, ShieldCheck, Zap, Globe, LayoutGrid, List } from 'lucide-react';
import { getTechnicalIndicators, esgBreakdown } from '../data/mockData';

const FILTERS = [
  { id: 'all', label: 'All Assets' },
  { id: 'buy', label: 'AI Buy Signals', icon: Sparkles, color: 'emerald' },
  { id: 'gainers', label: 'Top Gainers', icon: TrendingUp },
  { id: 'esg', label: 'High ESG', icon: ShieldCheck },
  { id: 'tech', label: 'Tech & AI', icon: Zap },
  { id: 'us', label: 'US Market', icon: Globe },
  { id: 'watchlist', label: 'Watchlist', icon: Bookmark },
];

export default function StockShowcase({ stocks, onSelectStock, watchlist, onToggleWatchlist, onNavigateTab }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');

  const filtered = stocks.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q) && !s.sector.toLowerCase().includes(q)) return false;
    if (filter === 'buy') return s.aiSignal.includes('BUY');
    if (filter === 'gainers') return s.change >= 0;
    if (filter === 'esg') return s.esgScore >= 80;
    if (filter === 'tech') return /technology|semiconductors|software/i.test(s.sector);
    if (filter === 'us') return s.country === 'US';
    if (filter === 'watchlist') return watchlist.includes(s.id);
    return true;
  });

  const signalStyle = (signal) => {
    if (signal.includes('BUY')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (signal === 'UNDERPERFORM' || signal === 'SELL') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="space-y-5">
      
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by company, ticker, or sector..."
              className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <button onClick={() => setView('grid')} className={`px-3 py-1.5 rounded-md text-[12px] font-medium flex items-center gap-1.5 ${view === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                <LayoutGrid size={14} /> Grid
              </button>
              <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-[12px] font-medium flex items-center gap-1.5 ${view === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                <List size={14} /> Table
              </button>
            </div>
            <span className="text-[12px] text-gray-500 hidden sm:block">
              <span className="font-mono font-semibold text-gray-800">{filtered.length}</span> / {stocks.length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-gray-100">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap flex items-center gap-1.5 border transition-colors ${
                filter === f.id ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.icon && <f.icon size={13} />}
              {f.label}
              {f.id === 'watchlist' && <span className="text-[10px] font-mono opacity-80">({watchlist.length})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-soft">
          <p className="text-[15px] font-semibold text-gray-800">No stocks match your filter</p>
          <p className="text-[13px] text-gray-500 mt-1">Try clearing your search or changing the category.</p>
          <button onClick={() => { setSearch(''); setFilter('all'); }} className="mt-4 px-4 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-lg hover:bg-blue-700">Reset Filters</button>
        </div>
      ) : view === 'grid' ? (
        /* ──── GRID VIEW ──── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(stock => {
            const up = stock.change >= 0;
            const ind = getTechnicalIndicators(stock.id);
            const esg = esgBreakdown[stock.id] || { grade: 'A', overall: 70 };
            const saved = watchlist.includes(stock.id);

            return (
              <div key={stock.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft hover:shadow-card-lg hover:border-blue-300 transition-all group flex flex-col">
                {/* Card Header */}
                <div className="bg-gray-900 p-4 text-white relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tracking-tight">{stock.id}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded font-mono">{stock.country}</span>
                    </div>
                    <button onClick={() => onToggleWatchlist(stock.id)} className={`p-1 rounded-md ${saved ? 'text-amber-400' : 'text-gray-500 hover:text-white'}`}>
                      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-3 relative z-10">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Price</span>
                      <span className="font-mono text-xl font-bold">
                        {stock.country === 'US' ? '$' : '₹'}{stock.price.toLocaleString(stock.country === 'US' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <span className={`font-mono text-[13px] font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-md ${up ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {up ? '+' : ''}{stock.pct}%
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 space-y-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{stock.name}</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5">{stock.sector}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-gray-500">AI Signal</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${signalStyle(stock.aiSignal)}`}>{stock.aiSignal}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-2.5 text-[11px]">
                      <div><span className="text-gray-400 block">P/E</span><span className="font-mono font-semibold text-gray-800">{stock.peRatio}x</span></div>
                      <div><span className="text-gray-400 block">Target</span><span className="font-mono font-semibold text-blue-600">{stock.country === 'US' ? '$' : '₹'}{stock.targetPrice}</span></div>
                      <div><span className="text-gray-400 block">RSI (14D)</span><span className="font-mono font-semibold text-gray-800">{ind.rsi}</span></div>
                      <div><span className="text-gray-400 block">ESG</span><span className="font-mono font-semibold text-gray-800">{stock.esgScore} ({esg.grade})</span></div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                  <button onClick={() => { onSelectStock(stock.id); onNavigateTab('dashboard'); }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[12px] font-semibold">
                    <BarChart2 size={14} /> Analyze
                  </button>
                  <button onClick={() => { onSelectStock(stock.id); onNavigateTab('chatbot'); }}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-[12px] font-semibold">
                    <MessageSquare size={14} /> Ask AI
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ──── TABLE VIEW ──── */
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Change</th>
                  <th className="py-3 px-4 text-center">AI Signal</th>
                  <th className="py-3 px-4 text-right">P/E</th>
                  <th className="py-3 px-4 text-center">ESG</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(stock => {
                  const up = stock.change >= 0;
                  const saved = watchlist.includes(stock.id);
                  return (
                    <tr key={stock.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <button onClick={() => onToggleWatchlist(stock.id)} className={saved ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'}>
                            {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                          </button>
                          {stock.id}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{stock.name}</td>
                      <td className="py-3 px-4 text-gray-500 text-[12px]">{stock.sector}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-gray-900">{stock.country === 'US' ? '$' : '₹'}{stock.price.toFixed(2)}</td>
                      <td className={`py-3 px-4 text-right font-mono font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>{up ? '+' : ''}{stock.pct}%</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${signalStyle(stock.aiSignal)}`}>{stock.aiSignal}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-gray-600">{stock.peRatio}x</td>
                      <td className="py-3 px-4 text-center font-mono text-gray-600">{stock.esgScore}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { onSelectStock(stock.id); onNavigateTab('dashboard'); }}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md border border-blue-200" title="Analyze">
                            <BarChart2 size={13} />
                          </button>
                          <button onClick={() => { onSelectStock(stock.id); onNavigateTab('chatbot'); }}
                            className="p-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-md border border-gray-200" title="Ask AI">
                            <MessageSquare size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
