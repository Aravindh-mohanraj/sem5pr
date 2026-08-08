import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  Bookmark, 
  BookmarkCheck, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Newspaper, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle,
  Users,
  Compass,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  stockHistories, 
  getTechnicalIndicators, 
  newsSentiment, 
  esgBreakdown, 
  holdingsData 
} from '../data/mockData';

export default function Dashboard({ stock, stocksList, onSelectStock, watchlist, onToggleWatchlist }) {
  const [chartMode, setChartMode] = useState('price');
  const indicators = getTechnicalIndicators(stock.id);
  const news = newsSentiment[stock.id] || [];
  const esg = esgBreakdown[stock.id] || { environmental: 50, social: 50, governance: 50, overall: 50, level: 'N/A', grade: 'B' };
  const holdings = holdingsData[stock.id] || { institutional: 50, promoter: 30, public: 20, insiderBuying: 'N/A' };
  
  const historyData = stockHistories[stock.id] || [];

  const avgSentiment = news.length > 0
    ? Math.round(news.reduce((sum, n) => sum + n.score, 0) / news.length)
    : 50;

  const getRecommendation = () => {
    const { rsi, predictions } = indicators;
    const change = predictions.days7ChangePct;
    
    let recommendation = 'HOLD';
    let colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
    let ratingScore = 52;
    let explanation = [];

    if (rsi < 35 && avgSentiment > 55) {
      recommendation = 'BUY';
      colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      ratingScore = 84;
      explanation = [
        `RSI = ${rsi} indicates the stock is technically oversold, presenting an attractive entry point.`,
        `News Sentiment is ${avgSentiment}% positive, showing solid public confidence.`,
        `Our LSTM models predict a 7-day rebound of +${predictions.days7ChangePct}% to ₹${predictions.days7.toFixed(2)}.`,
        `Insider transactions indicate institutional backing (${holdings.institutional}% shares) is holding firm.`
      ];
    } else if (rsi > 70 || (avgSentiment < 40 && change < -2)) {
      recommendation = 'SELL';
      colorClass = 'text-rose-700 bg-rose-50 border-rose-200';
      ratingScore = 22;
      explanation = [
        `RSI = ${rsi} shows heavily overbought conditions, increasing downside risk.`,
        `Negative news sentiment at ${avgSentiment}% suggests short-term macro headwinds.`,
        `Our LSTM model forecasts a decline of ${predictions.days7ChangePct}% over the next 7 days.`,
        `Insiders/Institutions are showing net selling patterns this quarter.`
      ];
    } else {
      recommendation = 'HOLD';
      colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
      ratingScore = 55;
      explanation = [
        `RSI is moderate at ${rsi}, showing balanced buying and selling pressure.`,
        `News flow is neutral to slightly positive (${avgSentiment}% sentiment score).`,
        `Short-term 7-day movement is predicted to remain stable (${change >= 0 ? '+' : ''}${change}%).`,
        `Promoter and institutional structures remain unchanged.`
      ];
    }

    return { recommendation, colorClass, ratingScore, explanation };
  };

  const { recommendation, colorClass, ratingScore, explanation } = getRecommendation();
  const isUp = stock.price >= stock.prevClose;
  const priceDiff = Number((stock.price - stock.prevClose).toFixed(2));
  const changePct = Number(((priceDiff / stock.prevClose) * 100).toFixed(2));

  const chartGradientColor = isUp ? '#059669' : '#e11d48';

  return (
    <div className="space-y-6">
      
      {/* Stock Selection & Main Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
            <span className="font-display font-black text-2xl text-sky-700 tracking-wider">
              {stock.id}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold text-slate-900">{stock.name}</h2>
              <button 
                onClick={() => onToggleWatchlist(stock.id)}
                className={`p-1.5 rounded-lg border transition-all ${
                  watchlist.includes(stock.id)
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-700'
                }`}
              >
                {watchlist.includes(stock.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-0.5">{stock.sector} • {stock.ticker}</p>
          </div>
        </div>

        <div className="flex items-end gap-6">
          <div className="text-right">
            <div className="text-3xl font-mono font-extrabold text-slate-900">
              {stock.country === 'US' ? '$' : '₹'}{stock.price.toLocaleString(stock.country === 'US' ? 'en-US' : 'en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center justify-end font-mono text-sm mt-0.5 font-bold ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              <span>{isUp ? '+' : ''}{priceDiff.toFixed(2)} ({isUp ? '+' : ''}{changePct}%)</span>
            </div>
          </div>
          
          <div className="border-l border-slate-200 pl-6 hidden sm:block">
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">Market Cap</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">{stock.marketCap}</span>
          </div>
          <div className="border-l border-slate-200 pl-6 hidden sm:block">
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">Volume</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block font-mono">{(stock.volume / 100000).toFixed(1)}L</span>
          </div>
        </div>
      </div>

      {/* Grid: Charts + AI Recommendations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Chart View */}
        <div className="xl:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[420px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button 
                onClick={() => setChartMode('price')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  chartMode === 'price'
                    ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Price Movement
              </button>
              <button 
                onClick={() => setChartMode('volume')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  chartMode === 'volume'
                    ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Volume Flow
              </button>
            </div>
            
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Compass size={14} className="text-sky-600" /> Real-time Simulation (3s Updates)
            </div>
          </div>

          <div className="flex-1 min-h-[280px]">
            {chartMode === 'price' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartGradientColor} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={chartGradientColor} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={10}
                    tickFormatter={(str) => {
                      const parts = str.split('-');
                      return parts.length === 3 ? `${parts[2]}/${parts[1]}` : str;
                    }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10} 
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `₹${val.toFixed(0)}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: '#64748b', fontSize: '11px' }}
                    itemStyle={{ color: '#0f172a', fontSize: '13px', fontWeight: 'bold' }}
                    formatter={(value) => [`₹${value.toFixed(2)}`, 'Close Price']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="close" 
                    stroke={chartGradientColor} 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={10}
                    tickFormatter={(str) => {
                      const parts = str.split('-');
                      return parts.length === 3 ? `${parts[2]}/${parts[1]}` : str;
                    }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={10}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value.toLocaleString()}`, 'Shares Traded']}
                  />
                  <Bar dataKey="volume" fill="#0284c7" radius={[4, 4, 0, 0]} opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right 1 Column: Explainable AI Recommendation Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-sky-600">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Explainable AI Rec</span>
              <span className="flex items-center gap-1 text-[11px] font-extrabold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                <CheckCircle size={11} /> FinBERT + LSTM
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className={`px-5 py-2.5 rounded-xl border-2 font-display font-black text-2xl tracking-wide ${colorClass}`}>
                {recommendation}
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-semibold">Confidence Score</span>
                <span className="text-lg font-bold text-slate-900">{ratingScore}% Bullish</span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Supporting Rationales:</p>
            <ul className="space-y-2.5">
              {explanation.map((item, index) => (
                <li key={index} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1"><AlertCircle size={12} className="text-amber-500 shrink-0" /> Explainable AI explains *why* signals form recommendations.</span>
          </div>
        </div>

      </div>

      {/* Grid: Indicators + News Sentiment + ESG/Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Technical Indicators */}
        <div className="glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-sky-600" /> Technical Indicators
            </h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">Live Calc</span>
          </div>

          {/* RSI Gauge */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">RSI (14-day Period)</span>
              <span className={indicators.rsi < 30 ? 'text-emerald-600 font-bold' : indicators.rsi > 70 ? 'text-rose-600 font-bold' : 'text-slate-800 font-bold'}>
                {indicators.rsi} ({indicators.rsi < 30 ? 'Oversold' : indicators.rsi > 70 ? 'Overbought' : 'Neutral'})
              </span>
            </div>
            <div className="relative h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div className="absolute left-[30%] top-0 bottom-0 w-[1px] bg-slate-300 z-10"></div>
              <div className="absolute left-[70%] top-0 bottom-0 w-[1px] bg-slate-300 z-10"></div>
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  indicators.rsi < 30 
                    ? 'bg-emerald-500' 
                    : indicators.rsi > 70 
                    ? 'bg-rose-500' 
                    : 'bg-sky-500'
                }`}
                style={{ width: `${indicators.rsi}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 px-0.5 font-medium">
              <span>0 (Oversold)</span>
              <span>30</span>
              <span>70</span>
              <span>100 (Overbought)</span>
            </div>
          </div>

          {/* SMA comparison */}
          <div className="flex items-center justify-between text-xs py-2.5 border-t border-b border-slate-100">
            <span className="text-slate-600 font-semibold">Simple Moving Avg (14 SMA)</span>
            <div className="text-right">
              <div className="font-mono font-bold text-slate-900">₹{indicators.sma14.toLocaleString()}</div>
              <div className={`text-[10px] font-bold ${stock.price >= indicators.sma14 ? 'text-emerald-600' : 'text-rose-600'}`}>
                Price is {stock.price >= indicators.sma14 ? 'Above (Bullish)' : 'Below (Bearish)'}
              </div>
            </div>
          </div>

          {/* MACD Histogram */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">MACD (12, 26, 9)</span>
            <div className="flex gap-3 font-mono font-bold">
              <span className="text-blue-600">L: {indicators.macd.line.toFixed(1)}</span>
              <span className="text-amber-600">S: {indicators.macd.signal.toFixed(1)}</span>
              <span className={indicators.macd.hist >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                H: {indicators.macd.hist.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Forecast Trend LSTM */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] text-sky-700 font-extrabold uppercase tracking-wider block">LSTM Forecast Predictions</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] font-medium">7-Day Forecast</span>
                <span className="font-mono font-extrabold text-slate-900">₹{indicators.predictions.days7.toFixed(1)}</span>
                <span className={`text-[9px] font-bold ml-1 ${indicators.predictions.days7ChangePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ({indicators.predictions.days7ChangePct >= 0 ? '+' : ''}{indicators.predictions.days7ChangePct}%)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-medium">30-Day Forecast</span>
                <span className="font-mono font-extrabold text-slate-900">₹{indicators.predictions.days30.toFixed(1)}</span>
                <span className={`text-[9px] font-bold ml-1 ${indicators.predictions.days30ChangePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ({indicators.predictions.days30ChangePct >= 0 ? '+' : ''}{indicators.predictions.days30ChangePct}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Sentiment Analysis */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Newspaper size={18} className="text-sky-600" /> News Sentiment
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700">Avg: {avgSentiment}%</span>
                <span className={`h-2.5 w-2.5 rounded-full ${
                  avgSentiment > 65 ? 'bg-emerald-500' : avgSentiment < 40 ? 'bg-rose-500' : 'bg-slate-400'
                }`}></span>
              </div>
            </div>

            <div className="space-y-3">
              {news.map(n => (
                <div key={n.id} className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-colors space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-normal">{n.title}</h4>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border shrink-0 ${
                      n.sentiment === 'positive' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : n.sentiment === 'negative' 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {n.sentiment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>{n.source} • {n.time}</span>
                    <span>AI Conf: {n.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>Powered by FinBERT Sentiment Engine</span>
          </div>
        </div>

        {/* Col 3: Insider Holdings & ESG */}
        <div className="glass-panel rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-sky-600" /> Holdings & ESG Insights
            </h3>
            <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${
              esg.overall >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              Grade: {esg.grade}
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Shareholding Structure</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Promoter / Founders</span>
                <span className="font-bold text-slate-900">{holdings.promoter}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Institutional (MF / FII)</span>
                <span className="font-bold text-slate-900">{holdings.institutional}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Retail & Public</span>
                <span className="font-bold text-slate-900">{holdings.public}%</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-600 font-semibold">Insider Transactions (3M)</span>
                <span className="font-bold text-emerald-700">{holdings.insiderBuying}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">ESG Factors</span>
            <div className="space-y-2 text-[11px]">
              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Environmental</span>
                  <span className="font-bold text-slate-900">{esg.environmental}/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-teal-500" style={{ width: `${esg.environmental}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Social</span>
                  <span className="font-bold text-slate-900">{esg.social}/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-indigo-500" style={{ width: `${esg.social}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Governance</span>
                  <span className="font-bold text-slate-900">{esg.governance}/100</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-emerald-500" style={{ width: `${esg.governance}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
