import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './famio-brand-theme.css'
import App from './App.tsx'
import './marketing-graphics.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="famio-app">
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>,
)
