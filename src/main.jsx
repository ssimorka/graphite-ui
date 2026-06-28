import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LeWittGenerator from './lewitt-generator.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LeWittGenerator />
  </StrictMode>,
)
