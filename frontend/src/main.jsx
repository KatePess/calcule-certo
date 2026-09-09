import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ProvedorStore } from './stores/index.jsx';
import './estilos/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProvedorStore>
        <App />
      </ProvedorStore>
    </BrowserRouter>
  </StrictMode>,
);
