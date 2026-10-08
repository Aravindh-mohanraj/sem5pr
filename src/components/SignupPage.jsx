import React, { useState } from 'react';
import { TrendingUp, User, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RULES = [
  { test: p => p.length >= 6,   label: 'At least 6 characters' },
  { test: p => /[A-Z]/.test(p), label: 'One uppercase letter'  },
  { test: p => /\d/.test(p),    label: 'One number'            },
];

export default function SignupPage({ onSwitchToLogin }) {
  const { signup, loading, error, clearError } = useAuth();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [fieldErr, setFieldErr] = useState({});
  const [touched,  setTouched]  = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim())             errs.name     = 'Full name is required.';
    if (!email.trim())            errs.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email.';
    if (!password)                errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Minimum 6 characters.';
    if (password !== confirm)     errs.confirm  = 'Passwords do not match.';
    setFieldErr(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    await signup(name.trim(), email.trim(), password);
  };

  const pwdStrength   = RULES.filter(r => r.test(password)).length;
  const strengthColor = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500'][pwdStrength - 1] || 'bg-gray-200';
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][pwdStrength] || '';

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
          <h2 className="text-xl font-bold text-gray-900 mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm mb-6">Start analyzing markets with AI today.</p>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setFieldErr(p => ({ ...p, name: '' })); }}
                  placeholder="Ajai Kumar"
                  className={`w-full bg-gray-50 border ${fieldErr.name ? 'border-rose-400' : 'border-gray-200'} focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all`}
                />
              </div>
              {fieldErr.name && <p className="text-rose-500 text-xs mt-1">{fieldErr.name}</p>}
            </div>

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
                  onChange={e => { setPassword(e.target.value); setTouched(true); setFieldErr(p => ({ ...p, password: '' })); }}
                  placeholder="Min. 6 characters"
                  className={`w-full bg-gray-50 border ${fieldErr.password ? 'border-rose-400' : 'border-gray-200'} focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all`}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldErr.password && <p className="text-rose-500 text-xs mt-1">{fieldErr.password}</p>}

              {/* Strength meter */}
              {touched && password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1 h-1.5">
                    {[0,1,2].map(i => (
                      <div key={i} className={`flex-1 rounded-full transition-all ${i < pwdStrength ? strengthColor : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex gap-3 flex-wrap">
                      {RULES.map((r, i) => (
                        <span key={i} className={`text-[10px] flex items-center gap-0.5 ${r.test(password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {r.test(password) ? <CheckCircle2 size={10} /> : '○'} {r.label}
                        </span>
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold ${pwdStrength === 3 ? 'text-emerald-600' : pwdStrength === 2 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {strengthLabel}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showConf ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setFieldErr(p => ({ ...p, confirm: '' })); }}
                  placeholder="Re-enter password"
                  className={`w-full bg-gray-50 border ${
                    fieldErr.confirm ? 'border-rose-400' : confirm && confirm === password ? 'border-emerald-400' : 'border-gray-200'
                  } focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all`}
                />
                <button type="button" onClick={() => setShowConf(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldErr.confirm
                ? <p className="text-rose-500 text-xs mt-1">{fieldErr.confirm}</p>
                : confirm && confirm === password
                  ? <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1"><CheckCircle2 size={11} /> Passwords match</p>
                  : null
              }
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-sm transition-all mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Sign in
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">AI Stock Analyzer • React + FastAPI + SQLite</p>
      </div>
    </div>
  );
}
