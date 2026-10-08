import React, { useState } from 'react';
import { TrendingUp, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onSwitchToSignup }) {
  const { login, loading, error, clearError } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [fieldErr, setFieldErr] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim())    errs.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email address.';
    if (!password)        errs.password = 'Password is required.';
    setFieldErr(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    await login(email.trim(), password);
  };

  const fillDemo = () => {
    setEmail('ajai.kumar@investor.in');
    setPassword('demo1234');
    setFieldErr({});
    clearError();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 mb-4">
            <TrendingUp size={28} strokeWidth={2.5} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Stock Analyzer</h1>
          <p className="text-gray-500 text-sm mt-1.5">India's Intelligent Investment Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to your account to continue.</p>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setFieldErr(p => ({ ...p, email: '' })); }}
                  placeholder="you@example.com"
                  className={`w-full bg-gray-50 border ${fieldErr.email ? 'border-rose-400' : 'border-gray-200'} focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all`}
                />
              </div>
              {fieldErr.email && <p className="text-rose-500 text-xs mt-1">{fieldErr.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setFieldErr(p => ({ ...p, password: '' })); }}
                  placeholder="••••••••"
                  className={`w-full bg-gray-50 border ${fieldErr.password ? 'border-rose-400' : 'border-gray-200'} focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all`}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldErr.password && <p className="text-rose-500 text-xs mt-1">{fieldErr.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-sm transition-all mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          {/* Demo box */}
          <div className="mt-4 p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-700 font-semibold mb-2">🚀 Demo Account</p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 space-y-0.5">
                <p>Email: <span className="font-mono text-gray-800">ajai.kumar@investor.in</span></p>
                <p>Password: <span className="font-mono text-gray-800">demo1234</span></p>
              </div>
              <button onClick={fillDemo}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                Fill
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <button onClick={onSwitchToSignup} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Create one
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">AI Stock Analyzer • React + FastAPI + SQLite</p>
      </div>
    </div>
  );
}
