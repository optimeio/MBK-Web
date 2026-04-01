import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Point to Render backend in production, otherwise use Vite proxy on local
axios.defaults.baseURL = import.meta.env.MODE === 'production' ? 'https://mbk-web.onrender.com' : '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
