import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { OfertaContext } from './Oferta';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Breadcrumbs from '@mui/material/Breadcrumbs';

function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}

function Materias() {
  const navigate = useNavigate();
  const { loading, oferta, materiasSelected, setMateriasSelected } = useContext(OfertaContext);
  const [materias, setMaterias] = useState<null | string[]>(null);
  useEffect(() => {
    setMaterias((oferta || []).map((o) => o.departamento ? `Puntos ${o.departamento}` : o.materia).filter(onlyUnique));
  }, [oferta]);
  const [checked, setChecked] = React.useState<null | string[]>(null);

  useEffect(() => {
    if (checked === null) {
      setChecked(materiasSelected || []);
    }
  }, [materiasSelected, checked])

  const handleToggle = (value: string) => () => {
    const currentIndex = (checked as string[]).indexOf(value);
    const newChecked = [...(checked as string[])];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const save = () => {
    setMateriasSelected(checked);
  };

  if (loading || !materias || checked === null) {
    return (<>Loading...</>)
  }
  return (<>
    <Breadcrumbs>
      <Link to="/">
        Inscripción
      </Link>
      <span>Materias</span>
    </Breadcrumbs>
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {materias.map((value: string) => {
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
    <Button onClick={() => { save(); navigate('/') } }>Anterior</Button>
    <Button onClick={() => { save(); navigate('/horarios') } }>Siguiente</Button>
  </>);
}

export default Materias;
