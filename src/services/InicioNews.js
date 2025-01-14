/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */

import { useEffect, useState } from 'react';
import { getCategories, getNewsByCategoryId } from './NewsApi';

const CATEGORY_DEFAULT = 77;

// Hook personalizado para manejar categorías y noticias
export const BuscarNoticiasPortadaData = () => {
  // const [categories, setCategories] = useState([]);
  const [newsByCategory, setNewsByCategory] = useState({});

  useEffect(() => {
    const fetchCategoriesAndNews = async () => {
      try {
        // Obtener las categorías
        const categoriesResponse = await getCategories();
        const categoryIds = categoriesResponse.map((category) => category.id);
        // setCategories(categoryIds);

        // --------------------------- Registrar el inicio del tiempo

        const startTime = performance.now();

        // Realizar consultas en paralelo para obtener noticias por cada categoría
        const newsPromises = [CATEGORY_DEFAULT, ...categoryIds].map((id) =>
          getNewsByCategoryId(id)
        );
        const newsResults = await Promise.all(newsPromises);

        // Organizar los resultados en un objeto con los IDs de las categorías como clave
        const newsData = categoryIds.reduce((acc, id, index) => {
          acc[id] = newsResults[index];
          return acc;
        }, {});

        setNewsByCategory(newsData);

        // --------------------------- Registrar el final del tiempo

        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000; // Convertir a segundos
        console.log(
          `Tiempo tomado para obtener las noticias: ${timeTaken.toFixed(2)} segundos-`
        );
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchCategoriesAndNews();
  }, []);

  // return { categories, newsByCategory }; // Devuelve todo el estado relevante
  return { newsByCategory };
};
