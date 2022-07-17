import React from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function Welcome() {
  const navigate = useNavigate();
  return (
    <Box>
      <p>
        Bienvenide. Veamos qué materias nos interesan y horarios disponibles hay
        para elegir una mejor inscripción.<br />
        <Button onClick={() => navigate('/materias')}>Empezar</Button>
      </p>
    </Box>
  );
}

export default Welcome;
