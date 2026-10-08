import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppSettingsProvider } from './context/AppSettings.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppSettingsProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppSettingsProvider>
  </React.StrictMode>,
)
