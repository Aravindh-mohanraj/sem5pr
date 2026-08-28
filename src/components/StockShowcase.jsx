import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Bookmark, 
  BookmarkCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  MessageSquare,
  BarChart2,
  ShieldCheck,
  Zap,
  Globe,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Target,
  BarChart3
} from 'lucide-react';
import { getTechnicalIndicators, esgBreakdown } from '../data/mockData';

export default function StockShowcase({ stocks, onSelectStock, watchlist, onToggleWatchlist, onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = 
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'buy') return stock.aiSignal.includes('BUY');
    if (activeFilter === 'gainers') return stock.change >= 0;
    if (activeFilter === 'esg') return stock.esgScore >= 80;
    if (activeFilter === 'tech') return stock.sector.toLowerCase().includes('technology') || stock.sector.toLowerCase().includes('semiconductors') || stock.sector.toLowerCase().includes('software');
    if (activeFilter === 'us') return stock.country === 'US';
    if (activeFilter === 'watchlist') return watchlist.includes(stock.id);
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls Bar: Search, Category Filter Pills & View Switcher */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stocks by company, ticker, or sector (e.g. TCS, NVIDIA, Tech)..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 bg-slate-200 rounded-full px-2 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Controls: View Mode Switcher + Count */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Institutional Table View"
              >
                <List size={15} />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              <span className="text-slate-900 font-mono font-bold">{filteredStocks.length}</span> / {stocks.length} Assets
            </div>
          </div>

        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 pb-1 border-t border-slate-100">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                : 'bg-slate-100 border border-slate-200/80 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>All Assets</span>
            <span className="text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded-full text-slate-700 font-bold">{stocks.length}</span>
          </button>

          <button 
            onClick={() => setActiveFilter('buy')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'buy'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-slate-100 border border-slate-200/80 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles size={13} />
            <span>AI Buy Signals</span>
          </button>

          <button 
            onClick={() => setActiveFilter('gainers')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'gainers'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                : 'bg-slate-100 border border-slate-200/80 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TrendingUp size={13} />
            <span>Top Gainers</span>
          </button>

          <button 
            onClick={() => setActiveFilter('esg')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'esg'
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                : 'bg-slate-100 border border-slate-200/80 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck size={13} />
            <span>High ESG (≥80)</span>
          </button>

          <button 
            onClick={() => setActiveFilter('tech')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'tech'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                : 'bg-slate-100 border border-slate-200/80 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap size={13} />
            <span>Tech & AI</span>
          </button>

          <button 
            onClick={() => setActiveFilter('us')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'us'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                : 'bg-slate-100 border border-slate-200/80 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe size={13} />
            <span>US Market</span>
          </button>

          <button 
            onClick={() => setActiveFilter('watchlist')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'watchlist'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                : 'bg-slate-100 border border-slate-200/80 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bookmark size={13} />
            <span>Watchlist ({watchlist.length})</span>
          </button>
        </div>

      </div>

      {/* Main Display: Grid or Table View */}
      {filteredStocks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-sm">
          <p className="text-base font-bold text-slate-800">No stock models match your search or filter.</p>
          <p className="text-xs">Try clearing your search keyword or switching category pills.</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
            className="px-4 py-2 bg-sky-600 text-white font-semibold text-xs rounded-xl hover:bg-sky-500 transition-colors shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID SHOWCASE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStocks.map((stock) => {
            const isUp = stock.change >= 0;
            const indicators = getTechnicalIndicators(stock.id);
            const esg = esgBreakdown[stock.id] || { grade: 'AA', overall: 80 };
            const isBookmarked = watchlist.includes(stock.id);

            let signalBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            if (stock.aiSignal === 'UNDERPERFORM' || stock.aiSignal === 'SELL') signalBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
            if (stock.aiSignal === 'HOLD') signalBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div 
                key={stock.id}
                className="group bg-white border border-slate-200/90 hover:border-sky-400 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                
                {/* Visual Header Banner */}
                <div>
                  <div className="relative h-28 bg-gradient-to-tr from-slate-900 via-slate-800 to-sky-900 p-4 border-b border-slate-200 text-white flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-xl text-white tracking-wide">
                          {stock.id}
                        </span>
                        <span className="text-[10px] text-slate-200 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-700 font-mono font-bold">
                          {stock.country}
                        </span>
                      </div>

                      <button 
                        onClick={() => onToggleWatchlist(stock.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isBookmarked 
                            ? 'bg-amber-500 text-white border-amber-400 shadow-xs' 
                            : 'bg-slate-950/40 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                        title={isBookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
                      >
                        {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>
                    </div>

                    <div className="flex items-end justify-between z-10">
                      <div>
                        <span className="text-[10px] text-slate-300 block font-medium">Market Price</span>
                        <span className="font-mono font-extrabold text-lg text-white">
                          {stock.country === 'US' ? '$' : '₹'}{stock.price.toLocaleString(stock.country === 'US' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-1 rounded-lg border ${
                        isUp 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                          : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      }`}>
                        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{isUp ? '+' : ''}{stock.pct}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="p-5 space-y-4">
                    
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                        {stock.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-sans font-medium">{stock.sector}</p>
                    </div>

                    {/* AI Signal Badge & Fundamentals */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-semibold">AI Recommendation</span>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black tracking-wider ${signalBadgeClass}`}>
                          {stock.aiSignal}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">P/E Ratio</span>
                          <span className="font-mono font-bold text-slate-800">{stock.peRatio}x</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">Target Price</span>
                          <span className="font-mono font-bold text-sky-700">
                            {stock.country === 'US' ? '$' : '₹'}{stock.targetPrice}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">14-Day RSI</span>
                          <span className="font-mono font-bold text-slate-800">{indicators.rsi}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold">ESG Rating</span>
                          <span className="font-mono font-bold text-slate-800">{stock.esgScore}/100 ({esg.grade})</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      onSelectStock(stock.id);
                      onNavigateTab('dashboard');
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-all shadow-2xs"
                  >
                    <BarChart2 size={14} />
                    <span>Analyze</span>
                  </button>

                  <button 
                    onClick={() => {
                      onSelectStock(stock.id);
                      onNavigateTab('chatbot');
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-2xs"
                  >
                    <MessageSquare size={14} />
                    <span>Ask AI</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* INSTITUTIONAL TABLE VIEW */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3.5 px-4">Asset Ticker</th>
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Sector</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-right">24h Change</th>
                  <th className="py-3.5 px-4 text-center">AI Rating</th>
                  <th className="py-3.5 px-4 text-right">P/E</th>
                  <th className="py-3.5 px-4 text-right">14D RSI</th>
                  <th className="py-3.5 px-4 text-center">ESG</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStocks.map(stock => {
                  const isUp = stock.change >= 0;
                  const indicators = getTechnicalIndicators(stock.id);
                  const isBookmarked = watchlist.includes(stock.id);

                  let signalBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (stock.aiSignal === 'UNDERPERFORM' || stock.aiSignal === 'SELL') signalBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                  if (stock.aiSignal === 'HOLD') signalBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <tr key={stock.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 font-display">
                        <div className="flex items-center gap-2">
                          <button onClick={() => onToggleWatchlist(stock.id)} className="text-slate-400 hover:text-amber-500">
                            {isBookmarked ? <BookmarkCheck size={14} className="text-amber-500" /> : <Bookmark size={14} />}
                          </button>
                          <span>{stock.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{stock.name}</td>
                      <td className="py-3 px-4 text-slate-500">{stock.sector}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {stock.country === 'US' ? '$' : '₹'}{stock.price.toFixed(2)}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isUp ? '+' : ''}{stock.pct}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase ${signalBadgeClass}`}>
                          {stock.aiSignal}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">{stock.peRatio}x</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">{indicators.rsi}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">{stock.esgScore}/100</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => { onSelectStock(stock.id); onNavigateTab('dashboard'); }}
                            className="p-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg border border-sky-200 text-xs font-bold"
                            title="Open Analysis Dashboard"
                          >
                            <BarChart2 size={14} />
                          </button>
                          <button 
                            onClick={() => { onSelectStock(stock.id); onNavigateTab('chatbot'); }}
                            className="p-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200 text-xs font-bold"
                            title="Ask AI Mentor"
                          >
                            <MessageSquare size={14} />
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
