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

// Constants for individual asset metrics
const ASSET_METRICS = {
  TCS: { volatility: 0.12, expectedReturn: 0.11, color: '#10B981' }, // Emerald
  RELIANCE: { volatility: 0.15, expectedReturn: 0.13, color: '#F59E0B' }, // Amber
  INFY: { volatility: 0.13, expectedReturn: 0.115, color: '#3B82F6' }, // Blue
  AAPL: { volatility: 0.16, expectedReturn: 0.14, color: '#8B5CF6' }, // Purple
  TSLA: { volatility: 0.28, expectedReturn: 0.19, color: '#EF4444' }  // Red
};

const RISK_FREE_RATE = 0.06; // 6% risk-free rate

export default function PortfolioOptimizer({ stocks }) {
  // Weights state: total must equal 100%
  const [weights, setWeights] = useState({
    TCS: 20,
    RELIANCE: 20,
    INFY: 20,
    AAPL: 20,
    TSLA: 20
  });

  const [portfolioStats, setPortfolioStats] = useState({
    expectedReturn: 0,
    volatility: 0,
    sharpeRatio: 0,
    riskRating: 'Medium',
    riskColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  });

  const [recomText, setRecomText] = useState('');

  // Re-run portfolio calculations when weights change
  useEffect(() => {
    calculatePortfolio(weights);
  }, [weights]);

  const calculatePortfolio = (w) => {
    // Normalise weights to sum to 1.0
    const keys = Object.keys(w);
    const totalWeight = keys.reduce((sum, k) => sum + w[k], 0);
    if (totalWeight === 0) return;

    // Convert weights to fractions
    const fracWeights = {};
    keys.forEach(k => {
      fracWeights[k] = w[k] / totalWeight;
    });

    // 1. Calculate Expected Return
    let expectedReturn = 0;
    keys.forEach(k => {
      expectedReturn += fracWeights[k] * ASSET_METRICS[k].expectedReturn;
    });

    // 2. Calculate Portfolio Volatility (MPT Formula)
    // variance = sum_i sum_j (w_i * w_j * vol_i * vol_j * correlation_ij)
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

    // 3. Sharpe Ratio
    const sharpeRatio = (expectedReturn - RISK_FREE_RATE) / volatility;

    // Risk Rating
    let riskRating = 'Medium Risk';
    let riskColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    if (volatility < 0.13) {
      riskRating = 'Low Risk (Conservative)';
      riskColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (volatility > 0.17) {
      riskRating = 'High Risk (Aggressive)';
      riskColor = 'text-red-400 bg-red-500/10 border-red-500/30';
    }

    setPortfolioStats({
      expectedReturn: expectedReturn * 100,
      volatility: volatility * 100,
      sharpeRatio,
      riskRating,
      riskColor
    });

    // Generate explanations
    let explanation = `Your portfolio has a Sharpe Ratio of ${sharpeRatio.toFixed(2)}. `;
    if (w.TSLA > 30) {
      explanation += `High concentration in TSLA (volatility ${ASSET_METRICS.TSLA.volatility * 100}%) inflates the risk score. Consider rebalancing into low correlation assets like RELIANCE to stabilize.`;
    } else if (w.TCS + w.INFY > 50) {
      explanation += `Tech stocks (TCS & INFY) are highly correlated (0.78), creating sector exposure. Diversify to lower volatility.`;
    } else {
      explanation += `Excellent diversification. Correlation factors are well-distributed across energy and global consumer electronics.`;
    }
    setRecomText(explanation);
  };

  const handleAdjustWeight = (asset, amt) => {
    setWeights(prev => {
      const currentVal = prev[asset];
      const newVal = Math.max(0, currentVal + amt);
      
      // We will adjust other assets proportionally to maintain 100% total if possible,
      // or let the user adjust manually and display validation.
      return {
        ...prev,
        [asset]: newVal
      };
    });
  };

  // Perform Monte Carlo Search to find the Maximum Sharpe Ratio Portfolio
  const runOptimizer = () => {
    let maxSharpe = -999;
    let bestWeights = {};
    const assets = Object.keys(weights);

    // Run 2000 simulations
    for (let sim = 0; sim < 2000; sim++) {
      // Generate random weights
      const randWeights = {};
      let sum = 0;
      assets.forEach(k => {
        const val = Math.random();
        randWeights[k] = val;
        sum += val;
      });

      // Normalise and convert to percentages summing to 100
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

      // Calculate Sharpe Ratio for this simulation
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

  // Prepare chart data
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
          <h2 className="font-display text-2xl font-bold">Portfolio Risk & MPT Optimizer</h2>
          <p className="text-slate-400 text-sm mt-1">Configure asset weights to calculate Sharpe ratio, risk level, and run MPT optimization.</p>
        </div>
        <button 
          onClick={runOptimizer}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 glow-btn-green transition-all shadow-lg shadow-emerald-500/10"
        >
          <Zap size={14} className="fill-slate-950" /> Run AI MPT Optimizer
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Asset Weights Configurator */}
        <div className="xl:col-span-2 glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg">Portfolio Assets</h3>
            <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full ${
              totalWeight === 100 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400 animate-pulse'
            }`}>
              Total: {totalWeight}% {totalWeight !== 100 && '(Must sum to 100%)'}
            </span>
          </div>

          <div className="space-y-4">
            {Object.keys(weights).map(asset => {
              const weight = weights[asset];
              const metrics = ASSET_METRICS[asset];
              return (
                <div key={asset} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: metrics.color }}></span>
                    <div>
                      <span className="font-bold text-slate-200 block text-sm">{asset}</span>
                      <span className="text-[10px] text-slate-500 block">
                        Exp. Return: {(metrics.expectedReturn * 100).toFixed(1)}% • Volatility: {(metrics.volatility * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAdjustWeight(asset, -5)}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-mono font-bold text-sm text-slate-200">
                        {weight}%
                      </span>
                      <button 
                        onClick={() => handleAdjustWeight(asset, 5)}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="w-24 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${weight}%`, backgroundColor: metrics.color }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mathematical & Graphical Diagnostics */}
        <div className="space-y-6">
          
          {/* Risk Diagnostic Summary */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base">Risk Diagnostics</h3>
            
            <div className={`p-4 rounded-xl border-2 font-display text-center ${portfolioStats.riskColor}`}>
              <span className="text-xs uppercase font-semibold block text-slate-400">Risk Profile</span>
              <span className="text-lg font-black tracking-wide block mt-1">{portfolioStats.riskRating}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center py-2.5">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Expected Return</span>
                <span className="text-base font-mono font-bold text-slate-200">{portfolioStats.expectedReturn.toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Portfolio Volatility</span>
                <span className="text-base font-mono font-bold text-slate-200">{portfolioStats.volatility.toFixed(2)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-3 border-t border-slate-900">
              <span className="text-slate-400 font-medium">Sharpe Ratio</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {portfolioStats.sharpeRatio.toFixed(2)}
              </span>
            </div>
            
            {/* Visual allocation chart */}
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
                  <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Assets</span>
                  <span className="text-sm font-bold text-slate-300">{pieChartData.length} Stocks</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Mentor Advice */}
          <div className="glass-panel rounded-2xl p-6 border-l-2 border-emerald-500 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Lightbulb size={14} /> AI Portfolio Mentor Advice
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{recomText}</p>
            <p className="text-[10px] text-slate-500 leading-normal">
              Modern Portfolio Theory (MPT) optimizes weights by analyzing covariance (how assets swing together).
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
