import { getCategories, getNewsByCategoryId } from './NewsApi';

const CATEGORY_DEFAULT = { id: '77', title: 'Portada' };

export const BuscarNoticiasPortadaData = async () => {
  try {
    // Obtiene las categorías
    const categoriesResponse = await getCategories();

    // Agrega la categoría predeterminada al inicio de las categorías
    const allCategories = [CATEGORY_DEFAULT, ...categoriesResponse];

    // Obtiene noticias por cada categoría en paralelo y resuelve los datos completamente
    const newsResults = await Promise.all(
      allCategories.map(async (category) => {
        const news = await getNewsByCategoryId(category.id);
        return news.map((item) => ({
          date: item.date,
          id: item.id,
          link: item.link,
          title: item.title.rendered, // Aseguramos el acceso a la propiedad "rendered"
          yoast_head_json: item.yoast_head_json, // Incluye los datos completos de yoast_head_json
        }));
      })
    );

    return newsResults.slice(0, 2);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error; // Lanza el error para manejarlo desde donde se llame a la función
  }
};
