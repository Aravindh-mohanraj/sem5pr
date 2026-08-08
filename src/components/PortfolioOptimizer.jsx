import React, { useState, useEffect } from 'react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { 
  Plus, 
  Minus, 
  RefreshCw, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { stockCorrelations } from '../data/mockData';

const ASSET_METRICS = {
  TCS: { volatility: 0.12, expectedReturn: 0.11, color: '#10B981' },
  RELIANCE: { volatility: 0.15, expectedReturn: 0.13, color: '#F59E0B' },
  NVDA: { volatility: 0.26, expectedReturn: 0.22, color: '#0284c7' },
  INFY: { volatility: 0.13, expectedReturn: 0.115, color: '#3B82F6' },
  AAPL: { volatility: 0.16, expectedReturn: 0.14, color: '#8B5CF6' },
  MSFT: { volatility: 0.14, expectedReturn: 0.15, color: '#6366F1' },
  TSLA: { volatility: 0.28, expectedReturn: 0.19, color: '#EF4444' },
  HDFCBANK: { volatility: 0.11, expectedReturn: 0.105, color: '#EC4899' }
};

const RISK_FREE_RATE = 0.06;

export default function PortfolioOptimizer({ stocks }) {
  const [weights, setWeights] = useState({
    TCS: 15,
    RELIANCE: 15,
    NVDA: 15,
    INFY: 10,
    AAPL: 15,
    MSFT: 15,
    TSLA: 5,
    HDFCBANK: 10
  });

  const [portfolioStats, setPortfolioStats] = useState({
    expectedReturn: 0,
    volatility: 0,
    sharpeRatio: 0,
    riskRating: 'Medium Risk',
    riskColor: 'text-amber-700 bg-amber-50 border-amber-200'
  });

  const [recomText, setRecomText] = useState('');

  useEffect(() => {
    calculatePortfolio(weights);
  }, [weights]);

  const calculatePortfolio = (w) => {
    const keys = Object.keys(w);
    const totalWeight = keys.reduce((sum, k) => sum + w[k], 0);
    if (totalWeight === 0) return;

    const fracWeights = {};
    keys.forEach(k => {
      fracWeights[k] = w[k] / totalWeight;
    });

    let expectedReturn = 0;
    keys.forEach(k => {
      expectedReturn += fracWeights[k] * ASSET_METRICS[k].expectedReturn;
    });

    let variance = 0;
    keys.forEach(i => {
      keys.forEach(j => {
        const weightI = fracWeights[i];
        const weightJ = fracWeights[j];
        const volI = ASSET_METRICS[i].volatility;
        const volJ = ASSET_METRICS[j].volatility;
        const correlationIJ = stockCorrelations[i][j];
        
        variance += weightI * weightJ * volI * volJ * correlationIJ;
      });
    });

    const volatility = Math.sqrt(variance);
    const sharpeRatio = (expectedReturn - RISK_FREE_RATE) / volatility;

    let riskRating = 'Medium Risk';
    let riskColor = 'text-amber-700 bg-amber-50 border-amber-200';
    if (volatility < 0.13) {
      riskRating = 'Low Risk (Conservative)';
      riskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (volatility > 0.17) {
      riskRating = 'High Risk (Aggressive)';
      riskColor = 'text-rose-700 bg-rose-50 border-rose-200';
    }

    setPortfolioStats({
      expectedReturn: expectedReturn * 100,
      volatility: volatility * 100,
      sharpeRatio,
      riskRating,
      riskColor
    });

    let explanation = `Your portfolio has a Sharpe Ratio of ${sharpeRatio.toFixed(2)}. `;
    if (w.TSLA + w.NVDA > 35) {
      explanation += `High concentration in high-volatility assets inflates the risk score. Consider rebalancing into lower correlation assets like HDFCBANK or RELIANCE.`;
    } else if (w.TCS + w.INFY > 50) {
      explanation += `Tech stocks (TCS & INFY) are highly correlated (0.78), creating sector exposure. Diversify to lower volatility.`;
    } else {
      explanation += `Excellent diversification. Correlation factors are well-distributed across tech, energy, and banking.`;
    }
    setRecomText(explanation);
  };

  const handleAdjustWeight = (asset, amt) => {
    setWeights(prev => {
      const currentVal = prev[asset];
      const newVal = Math.max(0, currentVal + amt);
      return { ...prev, [asset]: newVal };
    });
  };

  const runOptimizer = () => {
    let maxSharpe = -999;
    let bestWeights = {};
    const assets = Object.keys(weights);

    for (let sim = 0; sim < 2000; sim++) {
      const randWeights = {};
      let sum = 0;
      assets.forEach(k => {
        const val = Math.random();
        randWeights[k] = val;
        sum += val;
      });

      const finalWeights = {};
      let pctSum = 0;
      assets.forEach((k, idx) => {
        if (idx === assets.length - 1) {
          finalWeights[k] = 100 - pctSum;
        } else {
          const pct = Math.round((randWeights[k] / sum) * 100);
          finalWeights[k] = pct;
          pctSum += pct;
        }
      });

      let expectedReturn = 0;
      assets.forEach(k => {
        expectedReturn += (finalWeights[k] / 100) * ASSET_METRICS[k].expectedReturn;
      });

      let variance = 0;
      assets.forEach(i => {
        assets.forEach(j => {
          const weightI = finalWeights[i] / 100;
          const weightJ = finalWeights[j] / 100;
          const volI = ASSET_METRICS[i].volatility;
          const volJ = ASSET_METRICS[j].volatility;
          const correlationIJ = stockCorrelations[i][j];
          
          variance += weightI * weightJ * volI * volJ * correlationIJ;
        });
      });

      const volatility = Math.sqrt(variance);
      const sharpeRatio = (expectedReturn - RISK_FREE_RATE) / volatility;

      if (sharpeRatio > maxSharpe) {
        maxSharpe = sharpeRatio;
        bestWeights = finalWeights;
      }
    }

    setWeights(bestWeights);
  };

  const totalWeight = Object.keys(weights).reduce((sum, k) => sum + weights[k], 0);
  const pieChartData = Object.keys(weights)
    .filter(k => weights[k] > 0)
    .map(k => ({
      name: k,
      value: totalWeight > 0 ? Number(((weights[k] / totalWeight) * 100).toFixed(1)) : 0,
      color: ASSET_METRICS[k].color
    }));

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Portfolio Risk & MPT Optimizer</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Configure asset weights to calculate Sharpe ratio, risk level, and run MPT optimization.</p>
        </div>
        <button 
          onClick={runOptimizer}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition-all"
        >
          <Zap size={14} className="fill-white" /> Run AI MPT Optimizer
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Asset Weights Configurator */}
        <div className="xl:col-span-2 glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-slate-900">Portfolio Assets</h3>
            <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full ${
              totalWeight === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
            }`}>
              Total: {totalWeight}% {totalWeight !== 100 && '(Must sum to 100%)'}
            </span>
          </div>

          <div className="space-y-3">
            {Object.keys(weights).map(asset => {
              const weight = weights[asset];
              const metrics = ASSET_METRICS[asset];
              return (
                <div key={asset} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: metrics.color }}></span>
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{asset}</span>
                      <span className="text-[10px] text-slate-500 block font-medium">
                        Exp. Return: {(metrics.expectedReturn * 100).toFixed(1)}% • Volatility: {(metrics.volatility * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAdjustWeight(asset, -5)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-mono font-bold text-sm text-slate-900">
                        {weight}%
                      </span>
                      <button 
                        onClick={() => handleAdjustWeight(asset, 5)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${weight}%`, backgroundColor: metrics.color }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Diagnostics */}
        <div className="space-y-6">
          
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900">Risk Diagnostics</h3>
            
            <div className={`p-4 rounded-xl border-2 font-display text-center ${portfolioStats.riskColor}`}>
              <span className="text-xs uppercase font-semibold block text-slate-500">Risk Profile</span>
              <span className="text-lg font-black tracking-wide block mt-1">{portfolioStats.riskRating}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center py-2.5">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Expected Return</span>
                <span className="text-base font-mono font-bold text-slate-900">{portfolioStats.expectedReturn.toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Portfolio Volatility</span>
                <span className="text-base font-mono font-bold text-slate-900">{portfolioStats.volatility.toFixed(2)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-3 border-t border-slate-100 font-medium">
              <span className="text-slate-600 font-semibold">Sharpe Ratio</span>
              <span className="font-mono font-extrabold text-sky-700 text-base">
                {portfolioStats.sharpeRatio.toFixed(2)}
              </span>
            </div>
            
            {pieChartData.length > 0 && (
              <div className="h-40 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Assets</span>
                  <span className="text-sm font-bold text-slate-800">{pieChartData.length} Stocks</span>
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel rounded-2xl p-6 border-l-4 border-sky-600 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
              <Lightbulb size={14} /> AI Portfolio Mentor Advice
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{recomText}</p>
          </div>

        </div>

      </div>

    </div>
  );
}
