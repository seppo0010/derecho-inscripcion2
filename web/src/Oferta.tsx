import React, { useState, useEffect } from 'react';

export interface OfertaItem {
  materia: string,
  departamento: number,
  horario: string,
  comision: string,
  docente: string,
  modalidad: string,
  catedrasvirtuales_: {text: string, shortcode: string}[],
  centeno: string[],
  franja: string[],
}

export const OfertaContext = React.createContext<{
  loading: boolean,
  oferta: OfertaItem[] | null,
  materiasSelected: string[] | null,
  setMateriasSelected: (m: string[] | null) => void,
  horariosSelected: string[] | null,
  setHorariosSelected: (h: string[] | null) => void,
}>({
  loading: false,
  oferta: null,
  materiasSelected: null,
  setMateriasSelected: (m) => { },
  horariosSelected: null,
  setHorariosSelected: (h) => { },
});

export default function Oferta({ children }: { children: any }) {
  const [loading, setLoading] = useState(false);
  const [oferta, setOferta] = useState(null);
  const [materiasSelected, setMateriasSelected] = useState<string[] | null>(null);
  const [horariosSelected, setHorariosSelected] = useState<string[] | null>(null);
  useEffect(() => {
    if (loading || oferta) return;
    setLoading(true);
    fetch(`${process.env.PUBLIC_URL}/oferta.json`)
      .then((r) => r.json())
      .then((r) => {
        setLoading(false);
        setOferta(r);
      })
  }, [loading, oferta]);
  return (
    <OfertaContext.Provider value={{
        loading,
        oferta,
        materiasSelected, setMateriasSelected,
        horariosSelected, setHorariosSelected,
      }}>
      {children}
    </OfertaContext.Provider>
  );
}
