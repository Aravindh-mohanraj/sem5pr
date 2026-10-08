import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'asa-settings';

export const DEFAULT_SETTINGS = {
  themeMode: 'light',
  accentColor: 'sky',
  currency: 'native',
  updateInterval: 3000,
  soundEnabled: true,
  notifyTriggers: true,
  notifyNews: true,
};

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.documentElement.classList.toggle('dark', settings.themeMode === 'dark');
    document.documentElement.dataset.accent = settings.accentColor;
  }, [settings]);

  const updateSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

  return (
    <AppSettingsContext.Provider value={{ settings, setSettings, updateSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}
