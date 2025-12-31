import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('--- SISTEMA CARGADO ---')

// Script de diagnóstico CSP
try {
  eval('console.log("CSP Test: Eval permitido")');
} catch (e) {
  console.error("CSP Test: Eval bloqueado por el navegador", e);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
