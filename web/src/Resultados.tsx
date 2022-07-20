import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { OfertaContext, OfertaItem } from './Oferta';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function Resultados() {
  const {
    loading,
    oferta,
    materiasSelected,
    horariosSelected,
  } = useContext(OfertaContext);
  const [ofertaFiltered, setOfertaFiltered] = useState<OfertaItem[] | null>(null);
  useEffect(() => {
    setOfertaFiltered((oferta || []).filter((o) => (materiasSelected || []).includes(o.materia) && (horariosSelected || []).includes(o.horario)))
  }, [materiasSelected, horariosSelected, oferta]);

  if (loading || !ofertaFiltered) return (<>Loading...</>)
  return (<>
    <Breadcrumbs>
      <Link to="/">
        Inscripción
      </Link>
      <Link to="/materias">
        Materias
      </Link>
      <Link to="/horarios">
        Horarios
      </Link>
      <span>Resultados</span>
    </Breadcrumbs>
    {ofertaFiltered.length === 0 && 'Sin resultados'}
    {ofertaFiltered.map((item) => (
      <Accordion key={item.comision}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          {item.materia}<br />
          {item.horario}<br />
          {item.docente}<br />
          {item.modalidad}<br />
          {item.comision}<br />
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {item.catedrasvirtuales_.map(({ text, shortcode }) => ({
                  text,
                  link: `https://www.instagram.com/p/${shortcode}/`,
                }))
                .concat(item.franja.map((text) => ({
                  text,
                  link: `https://www.instagram.com/franjaderecho/`,
                })))
                .concat(item.centeno.map((text) => ({
                  text,
                  link: `https://www.instagram.com/centenoderecho/`,
                })))
              .map(({ text, link }, i: number) => {
              return (
                <ListItem
                  key={`${text},${i}`}
                  disablePadding
                >
                  <ListItemButton component="a" href={link}>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    ))}
  </>)
}
export default Resultados;
