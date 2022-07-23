import React, { useState, useEffect, useContext } from 'react';
import { OfertaContext, OfertaItem } from './Oferta';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

function Resultados() {
  const {
    loading,
    oferta,
    departamentos,
    materiasSelected,
    horariosSelected,
  } = useContext(OfertaContext);
  const [ofertaFiltered, setOfertaFiltered] = useState<OfertaItem[] | null>(null);
  useEffect(() => {
    if (!departamentos) return;
    setOfertaFiltered(
      (oferta || []).filter((o) => (
          (materiasSelected || []).includes(o.materia) ||
          (materiasSelected || []).includes(departamentos[o.departamento])
        ) && (horariosSelected || []).includes(o.horario)))
  }, [materiasSelected, horariosSelected, oferta, departamentos]);

  if (loading || !ofertaFiltered) return (<>Loading...</>)
  return (<>
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
            {item.catedrasvirtuales_.map(({ text, shortcode, sentiment }) => ({
                  text,
                  link: `https://www.instagram.com/p/${shortcode}/`,
                  sentiment: (sentiment.POS - sentiment.NEG + 1) / 2 as number,
                }))
                .concat(item.franja.map(({ text, sentiment }) => ({
                  text,
                  link: `https://www.instagram.com/franjaderecho/`,
                  sentiment: (sentiment.POS - sentiment.NEG + 1) / 2 as number,
                })))
                .concat(item.centeno.map(({ text, sentiment }) => ({
                  text,
                  link: `https://www.instagram.com/centenoderecho/`,
                  sentiment: (sentiment.POS - sentiment.NEG + 1) / 2 as number,
                })))
              .map(({ text, link, sentiment }, i: number) => {
              return (
                <ListItem
                  key={`${text},${i}`}
                  disablePadding
                >
                  <ListItemButton component="a" href={link}>
                    <div>
                      <LinearProgress variant="determinate" value={100 * sentiment} />
                      <ListItemText primary={text} />
                    </div>
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
