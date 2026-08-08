import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Palette, 
  Volume2, 
  VolumeX, 
  Bell, 
  Globe, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2,
  Sliders,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const [themeMode, setThemeMode] = useState('light');
  const [accentColor, setAccentColor] = useState('sky'); // 'sky', 'emerald', 'indigo', 'amber'
  const [currency, setCurrency] = useState('INR');
  const [updateInterval, setUpdateInterval] = useState('3000');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifyTriggers, setNotifyTriggers] = useState(true);
  const [notifyNews, setNotifyNews] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Application Settings & Configuration</h2>
        <p className="text-slate-500 text-sm mt-0.5 font-medium">Customize your theme preferences, currency, audio alerts, and real-time update frequencies.</p>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Application settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* 1. Theme & Appearance Settings */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Palette size={18} className="text-sky-600" /> Theme & Visual Style
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Color Mode Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Interface Theme Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    themeMode === 'light'
                      ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Sun size={16} className="text-amber-500" /> Light Theme
                </button>

                <button 
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    themeMode === 'dark'
                      ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Moon size={16} className="text-indigo-600" /> Dark Mode
                </button>
              </div>
            </div>

            {/* Accent Theme Color */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Primary Color Theme</label>
              <div className="grid grid-cols-4 gap-2">
                <button 
                  type="button"
                  onClick={() => setAccentColor('sky')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    accentColor === 'sky' ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/20' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full bg-sky-600"></span>
                  <span className="text-[10px]">Sky Blue</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setAccentColor('emerald')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    accentColor === 'emerald' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full bg-emerald-600"></span>
                  <span className="text-[10px]">Emerald</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setAccentColor('indigo')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    accentColor === 'indigo' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full bg-indigo-600"></span>
                  <span className="text-[10px]">Indigo</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setAccentColor('amber')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    accentColor === 'amber' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full bg-amber-500"></span>
                  <span className="text-[10px]">Amber</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Real-Time Market Data Engine Settings */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders size={18} className="text-sky-600" /> Market Simulation Engine
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Live Update Frequency</label>
              <select 
                value={updateInterval}
                onChange={(e) => setUpdateInterval(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="1000">Ultra Fast (Every 1 Second)</option>
                <option value="3000">Standard (Every 3 Seconds)</option>
                <option value="5000">Relaxed (Every 5 Seconds)</option>
                <option value="0">Pause Real-Time Updates</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Default Base Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              >
                <option value="INR">Indian Rupee (₹ INR)</option>
                <option value="USD">US Dollar ($ USD)</option>
                <option value="EUR">Euro (€ EUR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Audio & Notifications Preferences */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell size={18} className="text-sky-600" /> Alerts & Audio Chime
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 size={18} className="text-sky-600" /> : <VolumeX size={18} className="text-slate-400" />}
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Web Audio Alert Chimes</span>
                  <span className="text-[11px] text-slate-500">Play a sound when stock price triggers threshold alerts</span>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="h-4 w-4 text-sky-600 rounded focus:ring-sky-500 border-slate-300"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Price Threshold Popup Alerts</span>
                <span className="text-[11px] text-slate-500">Show persistent banner notifications when thresholds fire</span>
              </div>
              <input 
                type="checkbox"
                checked={notifyTriggers}
                onChange={(e) => setNotifyTriggers(e.target.checked)}
                className="h-4 w-4 text-sky-600 rounded focus:ring-sky-500 border-slate-300"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="font-bold text-xs text-slate-900 block">FinBERT Sentiment Headlines</span>
                <span className="text-[11px] text-slate-500">Highlight high confidence positive news breaking alerts</span>
              </div>
              <input 
                type="checkbox"
                checked={notifyNews}
                onChange={(e) => setNotifyNews(e.target.checked)}
                className="h-4 w-4 text-sky-600 rounded focus:ring-sky-500 border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20 transition-all"
          >
            <Settings size={16} /> Save Application Settings
          </button>
        </div>

      </form>

    </div>
  );
}
