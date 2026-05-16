import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.MODE === 'production' ? 'https://mbk-web-1.onrender.com' : '');
axios.defaults.baseURL = backendUrl;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
