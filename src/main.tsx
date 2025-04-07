import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import InteractiveMap from './components/InteractiveMap/InteractiveMap'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <header>
      <h1>MAPA UNIFOR</h1>
    </header>
    <main>
      <InteractiveMap />
    </main>
  </StrictMode>
);
