import React, { useState, useEffect } from 'react';

export interface OfertaItem {
  materia: string,
  departamento: number,
  horario: string,
  comision: string,
  docente: string,
  modalidad: string,
  catedrasvirtuales_: {
    text: string,
    shortcode: string,
    sentiment: {
      POS: number,
      NEU: number,
      NEG: number,
    },
  }[],
  centeno: {
    text: string,
    sentiment: {
      POS: number,
      NEU: number,
      NEG: number,
    },
  }[],
  franja: {
    text: string,
    sentiment: {
      POS: number,
      NEU: number,
      NEG: number,
    },
  }[],
}

export const OfertaContext = React.createContext<{
  loading: boolean,
  oferta: OfertaItem[] | null,
  departamentos: Record<string, string> | null,
  materiasSelected: string[] | null,
  setMateriasSelected: (m: string[] | null) => void,
  horariosSelected: string[] | null,
  setHorariosSelected: (h: string[] | null) => void,
}>({
  loading: false,
  oferta: null,
  departamentos: null,
  materiasSelected: null,
  setMateriasSelected: (m) => { },
  horariosSelected: null,
  setHorariosSelected: (h) => { },
});

export default function Oferta({ children }: { children: any }) {
  const [loading, setLoading] = useState(false);
  const [oferta, setOferta] = useState(null);
  const [departamentos, setDepartamentos] = useState(null);
  const [materiasSelected, setMateriasSelected] = useState<string[] | null>(null);
  const [horariosSelected, setHorariosSelected] = useState<string[] | null>(null);
  useEffect(() => {
    if (loading || oferta) return;
    setLoading(true);
    fetch(`${process.env.PUBLIC_URL}/oferta.json`)
      .then((r) => r.json())
      .then(({ oferta, departamentos }) => {
        setLoading(false);
        setOferta(oferta);
        setDepartamentos(departamentos);
      })
  }, [loading, oferta]);
  return (
    <OfertaContext.Provider value={{
        loading,
        oferta,
        departamentos,
        materiasSelected, setMateriasSelected,
        horariosSelected, setHorariosSelected,
      }}>
      {children}
    </OfertaContext.Provider>
  );
}
