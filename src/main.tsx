import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { TimetableProvider } from './context/TimetableContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TimetableProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TimetableProvider>
  </React.StrictMode>,
)
