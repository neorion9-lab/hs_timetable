import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { TimetableProvider } from './context/TimetableContext'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <TimetableProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TimetableProvider>
    </AuthProvider>
  </React.StrictMode>,
)
