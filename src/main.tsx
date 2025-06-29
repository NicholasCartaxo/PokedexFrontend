import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@vtex/shoreline/css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Pokedex from './components/Pokedex';
import Layout from './components/Layout';
import PokePage from './components/PokePage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Pokedex />} />
          <Route path="pokemon/:pokeId" element={<PokePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
