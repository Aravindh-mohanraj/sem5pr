import React, { useState } from 'react';
import { 
  Bell, 
  Trash2, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  BookmarkMinus, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  Volume2
} from 'lucide-react';

export default function Watchlist({ stocks, watchlist, onToggleWatchlist, alerts, onAddAlert, onSelectStock }) {
  const [alertStockId, setAlertStockId] = useState(stocks[0]?.id || '');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [alertType, setAlertType] = useState('above');
  const [activeTabSection, setActiveTabSection] = useState('all'); // 'all', 'active', 'triggered'

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

  const filteredAlerts = alerts.filter(a => {
    if (activeTabSection === 'active') return a.active;
    if (activeTabSection === 'triggered') return !a.active;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Alerts, Notifications & Watchlist</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">Manage price trigger alerts, active notifications, and your bookmarked stock watchlist.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Watchlist Section (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Watchlist Card */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-slate-900">My Watchlist ({watchlistStocks.length})</h3>
              <span className="text-xs text-slate-500 font-medium">Click stock name to launch Dashboard</span>
            </div>
            
            {watchlistStocks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <AlertCircle size={36} className="mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700">Your watchlist is empty.</p>
                <p className="text-xs mt-1 text-slate-500">Bookmark stocks from the showcase directory or dashboard to track them here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {watchlistStocks.map(stock => {
                  const isPositive = stock.change >= 0;
                  return (
                    <div key={stock.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div 
                        onClick={() => onSelectStock(stock.id)}
                        className="cursor-pointer group flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {stock.name} ({stock.id})
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{stock.sector}</span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-slate-900 block">
                          {stock.country === 'US' ? '$' : '₹'}{stock.price.toLocaleString(stock.country === 'US' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`font-mono text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPositive ? '+' : ''}{stock.pct}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onToggleWatchlist(stock.id)}
                          className="p-2 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
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

          {/* Trigger Notifications Log Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Bell size={18} className="text-sky-600" /> Notifications & Alerts Log
              </h3>

              <div className="flex gap-1.5 text-xs">
                <button 
                  onClick={() => setActiveTabSection('all')}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    activeTabSection === 'all' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  All ({alerts.length})
                </button>
                <button 
                  onClick={() => setActiveTabSection('active')}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    activeTabSection === 'active' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Active ({alerts.filter(a=>a.active).length})
                </button>
                <button 
                  onClick={() => setActiveTabSection('triggered')}
                  className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                    activeTabSection === 'triggered' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Fired ({alerts.filter(a=>!a.active).length})
                </button>
              </div>
            </div>

            {filteredAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No alerts match the selected filter.</p>
            ) : (
              <div className="space-y-3">
                {filteredAlerts.map(a => (
                  <div key={a.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${a.active ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                        <Bell size={16} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">{a.stockId} Price Alert</span>
                        <span className="text-slate-500 block text-[11px] font-medium">
                          Trigger when price goes {a.type === 'above' ? '≥' : '≤'} ₹{a.threshold}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        a.active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}>
                        {a.active ? 'Monitoring' : 'Fired / Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Alerts Configuration Panel (Right 1 column) */}
        <div className="space-y-6">
          
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-sky-600" /> Create Price Alert
            </h3>
            
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Select Stock</label>
                <select 
                  value={alertStockId}
                  onChange={(e) => setAlertStockId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                >
                  {stocks.map(s => (
                    <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Trigger Condition</label>
                  <select 
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                  >
                    <option value="above">Price Rises Above (≥)</option>
                    <option value="below">Price Falls Below (≤)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Threshold Price</label>
                  <input 
                    type="number"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    placeholder={`Current: ${getStockPrice(alertStockId).toFixed(0)}`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono font-bold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-sky-600/20 transition-all"
              >
                Create Active Trigger
              </button>
            </form>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Volume2 size={14} className="text-sky-600" /> Real-time Alert Audio
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              When stock price updates trigger a threshold alert, Web Audio Context plays a high frequency alert sound effect.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
