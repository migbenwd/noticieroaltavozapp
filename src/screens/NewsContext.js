import React, { createContext, useState, useEffect } from 'react';
import { BuscarNoticiasPortadaData } from '../services/InicioNews';

console.log('ENTRÓ en Archivo NewContext.js');

export const NewsContext = createContext();

export function NewsProvider({ children }) {
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /*
        const data = await BuscarNoticiasPortadaData();
        // console.log(data);
        setNewsData(data);
        */

        const dataArray = await BuscarNoticiasPortadaData();
        // console.log(dataArray);
        setNewsData(dataArray);
        console.log('LISTO PARA NAVEGAR en Archivo NewContext.js');

      } catch (error) {
        console.error('Error fetching news data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <NewsContext.Provider value={{ newsData, loading }}>
      {children}
    </NewsContext.Provider>
  );
}
