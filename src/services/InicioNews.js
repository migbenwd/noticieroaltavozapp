import React, { useEffect, useState } from 'react';
// import AppNavigation from './src/navigation';
import { getCategories, getNewsByCategoryId } from './src/services/NewsApi';

const [categories, setCategories] = useState([]);
const [newsByCategory, setNewsByCategory] = useState({});
const CATEGORY_DEFAULT = 77;

/*
export const getInicioNews = async () => {
  useEffect(() => {
    const fetchCategoriesAndNews = async () => {
      try {
        // Obtener las categorías
        const categoriesResponse = await getCategories();
        const categoryIds = categoriesResponse.map((category) => category.id);
        setCategories(categoryIds);
        console.log('Category IDs:', categoryIds);

        // Registrar el inicio del tiempo
        const startTime = performance.now();

        // Realizar consultas en paralelo para obtener noticias por cada categoría
        const newsPromises = [CATEGORY_DEFAULT, ...categoryIds].map((id) =>
          getNewsByCategoryId(id)
        );
        const newsResults = await Promise.all(newsPromises);

        // Registrar el final del tiempo
        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000; // Convertir a segundos
        console.log(
          `Time taken to fetch news: ${timeTaken.toFixed(2)} seconds`
        );

        // Organizar los resultados en un objeto con los IDs de las categorías como clave
        const newsData = categoryIds.reduce((acc, id, index) => {
          acc[id] = newsResults[index];
          return acc;
        }, {});

        setNewsByCategory(newsData);
        // console.log('News by Category:', newsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      return 77;
    };

    fetchCategoriesAndNews();
  }, []);

  // return extractImagesWithTheirSource(htmlContent);
};
*/

export const getPublicidad = async () => {
  const url = `https://noticieroaltavoz.com/wp-json/wp/v2/publicidad-app`;
  const response = await axios.get(url);
  const htmlContent = response.data[0].content.rendered;

  return extractImagesWithTheirSource(htmlContent);
};
