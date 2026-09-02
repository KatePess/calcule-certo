import { Navigate, Route, Routes } from 'react-router-dom';
import RotaProtegida from './componentes/RotaProtegida.jsx';
import SomenteVisitante from './componentes/SomenteVisitante.jsx';
import Cadastro from './paginas/Cadastro.jsx';
import Home from './paginas/Home.jsx';
import Login from './paginas/Login.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <SomenteVisitante>
            <Login />
          </SomenteVisitante>
        }
      />
      <Route
        path="/cadastro"
        element={
          <SomenteVisitante>
            <Cadastro />
          </SomenteVisitante>
        }
      />
      <Route
        path="/home"
        element={
          <RotaProtegida>
            <Home />
          </RotaProtegida>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
