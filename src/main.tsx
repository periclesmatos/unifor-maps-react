import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import InteractiveMap from './components/InteractiveMap/InteractiveMap'
import AddMarkerForm from './components/AddMarkerForm/AddMarkerForm';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <header>
      <h1>MAPA UNIFOR</h1>
    </header>
    <main>
      <InteractiveMap />
      <AddMarkerForm />
    </main>
  </StrictMode>
);
