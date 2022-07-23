import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={{
          '/': 0,
          '/materias': 1,
          '/horarios': 2,
          '/resultados': 3,
        }[location.pathname]}>
        <Tab label="Inicio" onClick={() => navigate('/')} />
        <Tab label="Materias" onClick={() => navigate('/materias')} />
        <Tab label="Horarios" onClick={() => navigate('/horarios')} />
        <Tab label="Resultados" onClick={() => navigate('/resultados')} />
      </Tabs>
    </Box>
  )
}

export default Navigation;
