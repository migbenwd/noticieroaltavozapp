import { useCallback } from 'react';
import { getCategories, getNewsByCategoryId } from './NewsApi';

const CATEGORY_DEFAULT = { id: '77', title: 'Portada' };

export const BuscarNoticiasPortadaData = async () => {
  const categories = await getCategories();

  const newsByCategoriesId = [CATEGORY_DEFAULT, ...categories].map(
    async (category) => {
      const news = await getNewsByCategoryId(category.id, 5);
      return {
        title: category.title,
        id: category.id,
        data: news,
      };
    }
  );

  return Promise.all(newsByCategoriesId);
};

/*
export const BuscarNoticiasPortadaData = async () => {
  try {
    // Obtiene las categorías
    const categories = await getCategories();

    const newsByCategoriesId = [CATEGORY_DEFAULT, ...categories].map(
      async (category) => {
        const news = await getNewsByCategoryId(category.id, 5);
        return {
          title: category.title,
          id: category.id,
          data: news,
        };
      }
    );

    console.log('newsByCategoriesId en BuscarPortada');
    console.log(newsByCategoriesId);

    return Promise.all(newsByCategoriesId);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error; // Lanza el error para manejarlo desde donde se llame a la función
  }
};
*/
