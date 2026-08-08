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
  SlidersHorizontal
} from 'lucide-react';
import { getTechnicalIndicators, esgBreakdown } from '../data/mockData';

export default function StockShowcase({ stocks, onSelectStock, watchlist, onToggleWatchlist, onNavigateTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = 
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.sector.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'buy') return stock.aiSignal === 'BUY';
    if (activeFilter === 'gainers') return stock.change >= 0;
    if (activeFilter === 'esg') return stock.esgScore >= 80;
    if (activeFilter === 'tech') return stock.sector.toLowerCase().includes('technology') || stock.sector.toLowerCase().includes('semiconductors') || stock.sector.toLowerCase().includes('software');
    if (activeFilter === 'us') return stock.country === 'US';
    if (activeFilter === 'watchlist') return watchlist.includes(stock.id);
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls Bar: Search & Category Filter Pills */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stocks by name, ticker, or sector (e.g. TCS, NVIDIA, Tech)..."
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

          <div className="flex items-center gap-2 text-xs text-slate-500 self-end md:self-auto font-medium">
            <SlidersHorizontal size={14} className="text-sky-600" />
            <span>Showing <strong className="text-slate-900 font-mono">{filteredStocks.length}</strong> of {stocks.length} themes & models</span>
          </div>

        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 pb-1 border-t border-slate-100">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>All Stocks</span>
            <span className="text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded-full text-slate-700">{stocks.length}</span>
          </button>

          <button 
            onClick={() => setActiveFilter('buy')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'buy'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles size={13} />
            <span>AI Buy Signals</span>
          </button>

          <button 
            onClick={() => setActiveFilter('gainers')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'gainers'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TrendingUp size={13} />
            <span>Top Gainers</span>
          </button>

          <button 
            onClick={() => setActiveFilter('esg')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'esg'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck size={13} />
            <span>High ESG (≥80)</span>
          </button>

          <button 
            onClick={() => setActiveFilter('tech')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'tech'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap size={13} />
            <span>Tech & AI</span>
          </button>

          <button 
            onClick={() => setActiveFilter('us')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'us'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe size={13} />
            <span>US Market</span>
          </button>

          <button 
            onClick={() => setActiveFilter('watchlist')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'watchlist'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bookmark size={13} />
            <span>Watchlist ({watchlist.length})</span>
          </button>
        </div>

      </div>

      {/* Grid Showcase of Stock Theme Cards (Crisp light mode) */}
      {filteredStocks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-sm">
          <p className="text-base font-bold text-slate-800">No stock themes match your filter criteria.</p>
          <p className="text-xs">Try adjusting your search terms or clearing active filters.</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
            className="px-4 py-2 bg-sky-600 text-white font-semibold text-xs rounded-xl hover:bg-sky-500 transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStocks.map((stock) => {
            const isUp = stock.change >= 0;
            const indicators = getTechnicalIndicators(stock.id);
            const esg = esgBreakdown[stock.id] || { grade: 'AA', overall: 80 };
            const isBookmarked = watchlist.includes(stock.id);

            let signalBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            if (stock.aiSignal === 'SELL') signalBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
            if (stock.aiSignal === 'HOLD') signalBadgeClass = 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div 
                key={stock.id}
                className="group bg-white hover:bg-white border border-slate-200 hover:border-sky-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                
                {/* Thumbnail Banner Header */}
                <div>
                  <div className="relative h-28 bg-gradient-to-tr from-slate-900 via-slate-800 to-sky-900 p-4 border-b border-slate-200 text-white flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-xl text-white tracking-wide">
                          {stock.id}
                        </span>
                        <span className="text-[10px] text-slate-200 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
                          {stock.country}
                        </span>
                      </div>

                      <button 
                        onClick={() => onToggleWatchlist(stock.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isBookmarked 
                            ? 'bg-amber-500 text-white border-amber-400 shadow-sm' 
                            : 'bg-slate-950/40 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                        title={isBookmarked ? "Remove from Watchlist" : "Add to Watchlist"}
                      >
                        {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                      </button>
                    </div>

                    <div className="flex items-end justify-between z-10">
                      <div>
                        <span className="text-[10px] text-slate-300 block font-medium">Live Price</span>
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

                    {/* AI Signal Badge & Metrics Grid */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">AI Signal</span>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-extrabold tracking-wider ${signalBadgeClass}`}>
                          {stock.aiSignal}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-medium">14-Day RSI</span>
                          <span className="font-mono font-bold text-slate-800">{indicators.rsi}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-medium">7D Forecast</span>
                          <span className={`font-mono font-bold ${indicators.predictions.days7ChangePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {indicators.predictions.days7ChangePct >= 0 ? '+' : ''}{indicators.predictions.days7ChangePct}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-medium">ESG Score</span>
                          <span className="font-mono font-bold text-slate-800">{stock.esgScore}/100 ({esg.grade})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-medium">Market Cap</span>
                          <span className="font-mono font-bold text-slate-800 line-clamp-1">{stock.marketCap}</span>
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
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-all"
                  >
                    <BarChart2 size={14} />
                    <span>Analyze</span>
                  </button>

                  <button 
                    onClick={() => {
                      onSelectStock(stock.id);
                      onNavigateTab('chatbot');
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>Ask AI</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
