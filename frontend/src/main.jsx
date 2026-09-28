// Estilos base primeiro: o CSS de cada tela, trazido pelo App, precisa vir
// depois para poder ajustar os estilos compartilhados.
import './estilos/global.css';
import './estilos/componentes.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ProvedorStore } from './stores/index.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProvedorStore>
        <App />
      </ProvedorStore>
    </BrowserRouter>
  </StrictMode>,
);
