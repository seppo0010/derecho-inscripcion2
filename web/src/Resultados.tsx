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
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

function Comment({ text, link, sentiment }: { text: string, link: string, sentiment: { POS: number, NEG: number }}) {
  const icon = sentiment.POS > 0.5  ? <ThumbUpAltIcon /> : (
    sentiment.NEG > 0.5 ? <ThumbDownAltIcon /> : <QuestionMarkIcon />
  );
  return (
    <ListItem
      disablePadding
      secondaryAction={icon}
    >
      <ListItemButton component="a" href={link}>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}

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
  const itemReviewSummary = (item: OfertaItem) => {
    const allReviews = [...item.catedrasvirtuales_, ...item.franja, ...item.centeno, ...item.tucatedraderecho]
    const relevantReviews = allReviews.filter(({ sentiment }) => sentiment.POS > 0.5 || sentiment.NEG > 0.5)
    const positiveReviews = relevantReviews.reduce((acc, { sentiment }, i, arr) => acc + (sentiment.POS > 0.5 ? 1 : 0), 0)
    if (relevantReviews.length === 0) { return ''; }
    return `${positiveReviews}/${relevantReviews.length} recomendaciones positivas`;
  }
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
          {itemReviewSummary(item)}
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {item.catedrasvirtuales_.map(({ text, shortcode, sentiment }, i) => (
                  <Comment key={`cv${i}`} text={text} link={`https://www.instagram.com/p/${shortcode}/`} sentiment={sentiment} />
                ))
                .concat(item.franja.map(({ text, sentiment }, i) => (
                  <Comment key={`franja${i}`} text={text} link={`https://www.instagram.com/p/franjaderecho/`} sentiment={sentiment} />
                )))
                .concat(item.centeno.map(({ text, sentiment }, i) => (
                  <Comment key={`centeno${i}`} text={text} link={`https://www.instagram.com/p/centenoderecho/`} sentiment={sentiment} />
                )))
                .concat(item.tucatedraderecho.map(({ text, sentiment }, i) => (
                  <Comment key={`tucatedraderecho{i}`} text={text} link={`https://tucatedraderecho.com.ar/`} sentiment={sentiment} />
                )))
            }
          </List>
        </AccordionDetails>
      </Accordion>
    ))}
  </>)
}
export default Resultados;
