import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Edit3, 
  CheckCircle2, 
  Briefcase, 
  Target, 
  Award,
  Clock,
  TrendingUp,
  Bookmark,
  Sparkles,
  Save,
  X
} from 'lucide-react';

export default function UserProfile({ watchlist, alerts }) {
  const [profile, setProfile] = useState({
    name: 'Aravindh Mohanraj',
    email: 'aravindh.mohanraj@gmail.com',
    tier: 'Pro Investor Tier',
    joined: 'August 2024',
    strategy: 'Balanced Growth',
    goal: 'Wealth Accumulation & Tech Stock Analytics',
    bio: 'Passionate Indian retail investor leveraging AI-driven quantitative models and Modern Portfolio Theory to optimize risk and returns across Indian and Global equities.',
    riskTolerance: 'Moderate'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/users')
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          const userObj = {
            name: data.name,
            email: data.email,
            tier: data.tier,
            joined: data.joined,
            strategy: data.strategy,
            goal: data.goal,
            bio: data.bio,
            riskTolerance: data.risk_tolerance || 'Moderate'
          };
          setProfile(userObj);
          setEditForm(userObj);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">User Profile & Account</h2>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">Manage your personal details, investment preferences, and membership status.</p>
        </div>

        <button 
          onClick={() => { setEditForm({ ...profile }); setIsEditing(!isEditing); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all self-start sm:self-auto"
        >
          <Edit3 size={15} />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Profile details updated successfully!</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: User Badge & Bio Card */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 text-center space-y-4">
            
            {/* Avatar Circle */}
            <div className="relative inline-block">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-xl shadow-sky-600/20 ring-4 ring-white">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="absolute bottom-1 right-1 h-5 w-5 bg-emerald-500 border-2 border-white rounded-full" title="Active Status"></span>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">{profile.name}</h3>
              <p className="text-xs text-sky-700 font-extrabold flex items-center justify-center gap-1 mt-1">
                <Sparkles size={12} /> {profile.tier}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center justify-center gap-2">
                <Mail size={14} className="text-slate-400" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span>Member since {profile.joined}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">Bio</span>
              <p className="text-slate-600 leading-relaxed font-medium">{profile.bio}</p>
            </div>

          </div>

          {/* Quick Stats Widget */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider">Platform Activity</h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold uppercase">Watchlist</span>
                <span className="font-mono font-extrabold text-xl text-sky-700">{watchlist.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold uppercase">Active Alerts</span>
                <span className="font-mono font-extrabold text-xl text-sky-700">{alerts.filter(a => a.active).length}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Profile Details & Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {isEditing ? (
            /* EDIT PROFILE FORM */
            <div className="glass-panel rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Edit3 size={18} className="text-sky-600" /> Edit Profile Information
                </h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input 
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                    <input 
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Investment Strategy</label>
                    <select
                      value={editForm.strategy}
                      onChange={(e) => setEditForm({ ...editForm, strategy: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                    >
                      <option value="Conservative Dividend Focus">Conservative Dividend Focus</option>
                      <option value="Balanced Growth">Balanced Growth</option>
                      <option value="Aggressive Tech & AI">Aggressive Tech & AI</option>
                      <option value="ESG Sustainable Investing">ESG Sustainable Investing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Risk Tolerance Level</label>
                    <select
                      value={editForm.riskTolerance}
                      onChange={(e) => setEditForm({ ...editForm, riskTolerance: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                    >
                      <option value="Low (Capital Preservation)">Low (Capital Preservation)</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High (Capital Appreciation)">High (Capital Appreciation)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Primary Investment Goal</label>
                  <input 
                    type="text"
                    value={editForm.goal}
                    onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Personal Bio</label>
                  <textarea 
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/20 transition-all"
                  >
                    <Save size={14} /> Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* VIEW PROFILE DETAILS */
            <div className="glass-panel rounded-2xl p-6 space-y-6">
              <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-sky-600" /> Investment Preferences & Profile Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Investment Strategy</span>
                  <span className="font-bold text-slate-900 text-sm">{profile.strategy}</span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Risk Tolerance</span>
                  <span className="font-bold text-sky-700 text-sm">{profile.riskTolerance}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Primary Investment Goal</span>
                <p className="font-bold text-slate-900 text-sm">{profile.goal}</p>
              </div>

              {/* Achievements & Badges */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Investor Badges & Level</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-2.5">
                    <Award size={18} className="text-sky-600 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-sky-900 block">AI Pioneer</span>
                      <span className="text-[10px] text-sky-700">Explored FinBERT</span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-emerald-900 block">Risk Optimizer</span>
                      <span className="text-[10px] text-emerald-700">MPT Calculated</span>
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5">
                    <Target size={18} className="text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-indigo-900 block">Alert Master</span>
                      <span className="text-[10px] text-indigo-700">Real-time Triggers</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
