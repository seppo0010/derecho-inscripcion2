import React, { useState, useEffect } from 'react';

export const OfertaContext = React.createContext<{
  loading: boolean,
  oferta: {
    materia: string,
    departamento: number,
    horario: string,
  }[] | null,
}>({
  loading: false,
  oferta: null,
});

export default function Oferta({ children }: { children: any }) {
  const [loading, setLoading] = useState(false);
  const [oferta, setOferta] = useState(null);
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
    <OfertaContext.Provider value={{ loading, oferta }}>
      {children}
    </OfertaContext.Provider>
  );
}
