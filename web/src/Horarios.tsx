import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { OfertaContext } from './Oferta';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}

function sortHorario(h1: string, h2: string) {
  const DATE: Record<string, number> = { 'Lun': 0, 'Mar': 1, 'Mie': 2, 'Jue': 3, 'Vie': 4, 'Sab': 5 };
  const d = DATE[h1.substring(0, 3)] - DATE[h2.substring(0, 3)];
  if (d === 0) {
    return h1.localeCompare(h2);
  }
  return d;
}

function Materias() {
  const navigate = useNavigate();
  const { loading, oferta } = useContext(OfertaContext);
  const [horarios, setHorarios] = useState<string[]>([]);
  useEffect(() => {
    setHorarios((oferta || []).map((o) => o.horario).filter(onlyUnique).sort(sortHorario));
  }, [oferta]);
  const [checked, setChecked] = React.useState<string[]>([]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  if (loading) {
    return (<>Loading...</>)
  }
  return (<>
    Materias:
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {horarios.map((value: string) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
    <Button onClick={() => navigate('/horarios')}>Siguiente</Button>
  </>);
}

export default Materias;
