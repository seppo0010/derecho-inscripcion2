import React from 'react';
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import Container from '@mui/material/Container';
import './App.css';
import Oferta from './Oferta';
import Welcome from './Welcome';
import Materias from './Materias';
import Horarios from './Horarios';
import Resultados from './Resultados';

function App() {
  return (
    <Container maxWidth="sm">
      <Oferta>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/materias" element={<Materias />} />
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/resultados" element={<Resultados />} />
          </Routes>
        </HashRouter>
      </Oferta>
    </Container>
  );
}

export default App;
