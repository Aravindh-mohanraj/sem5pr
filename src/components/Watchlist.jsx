import React, { useState } from 'react';
import { 
  Bell, 
  Trash2, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  BookmarkMinus, 
  AlertCircle,
  Clock
} from 'lucide-react';

export default function Watchlist({ stocks, watchlist, onToggleWatchlist, alerts, onAddAlert, onSelectStock }) {
  const [alertStockId, setAlertStockId] = useState(stocks[0]?.id || '');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [alertType, setAlertType] = useState('above'); // 'above' or 'below'

  const watchlistStocks = stocks.filter(s => watchlist.includes(s.id));

  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (!alertThreshold || isNaN(Number(alertThreshold))) return;

    onAddAlert({
      stockId: alertStockId,
      threshold: Number(alertThreshold),
      type: alertType
    });

    setAlertThreshold('');
  };

  const getStockPrice = (id) => {
    return stocks.find(s => s.id === id)?.price || 0;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-bold">Watchlist & Price Alerts</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your personalized watchlist and set real-time triggers for price movements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Watchlist Section (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-4">My Watchlist</h3>
            
            {watchlistStocks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <AlertCircle size={36} className="mx-auto mb-2 text-slate-600" />
                <p className="text-sm">Your watchlist is empty.</p>
                <p className="text-xs mt-1">Bookmark stocks from the tickers bar or dashboard to track them here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {watchlistStocks.map(stock => {
                  const isPositive = stock.change >= 0;
                  return (
                    <div key={stock.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div 
                        onClick={() => onSelectStock(stock.id)}
                        className="cursor-pointer group flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                            {stock.name} ({stock.id})
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">{stock.sector}</span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-sm block">
                          ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`font-mono text-xs ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}{stock.pct}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onToggleWatchlist(stock.id)}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
                          title="Remove from watchlist"
                        >
                          <BookmarkMinus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Alerts Configuration Panel (Right 1 column) */}
        <div className="space-y-6">
          
          {/* Create Alert Card */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Bell size={18} className="text-emerald-400" /> Set Price Alert
            </h3>
            
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Select Stock</label>
                <select 
                  value={alertStockId}
                  onChange={(e) => setAlertStockId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {stocks.map(s => (
                    <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Trigger Type</label>
                  <select 
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="above">Price Rises Above (≥)</option>
                    <option value="below">Price Falls Below (≤)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Trigger Price (₹)</label>
                  <input 
                    type="number"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    placeholder={`Current: ₹${getStockPrice(alertStockId).toFixed(0)}`}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold py-2.5 rounded-xl text-xs glow-btn-green transition-all"
              >
                Create Active Trigger
              </button>
            </form>
          </div>

          {/* Active Alerts List Card */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-bold text-sm text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={14} className="text-slate-400" /> Active Alert Triggers
            </h3>
            
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No active alerts set.</p>
            ) : (
              <div className="space-y-3">
                {alerts.map(a => (
                  <div key={a.id} className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-200">{a.stockId}</span>
                      <span className={`mx-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        a.type === 'above' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {a.type === 'above' ? '≥' : '≤'}
                      </span>
                      <span className="font-mono text-slate-300">₹{a.threshold}</span>
                    </div>
                    <span className={`text-[10px] ${a.active ? 'text-emerald-400 font-semibold' : 'text-slate-500 font-medium'}`}>
                      {a.active ? 'Active' : 'Triggered'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
