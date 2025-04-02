import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GoogleMapsComponent from './components/googleMpasComponent.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div>
      <h1>Mapa do Google</h1>
      <GoogleMapsComponent />
    </div>
  </StrictMode>,
)
