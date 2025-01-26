import axios from 'axios';
import { parse } from 'node-html-parser';
import { extractImagesWithTheirSource } from '../utils';

const apiBaseUrlAV = 'https://noticieroaltavoz.com/wp-json/wp/v2/posts/';
// Crear instancia de Axios con configuraciones predeterminadas para mejorar el rendimiento
const axiosInstance = axios.create({
  baseURL: apiBaseUrlAV,
  timeout: 5000, // Ajustar timeout según sea necesario
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  },
});

export const getNewsByCategoryId = async (categoryId, PaginadorId) => {
  const urlParams = new URLSearchParams({
    categories: categoryId,
    per_page: PaginadorId,
    _fields: 'id,title,link,date,yoast_head_json',
  }).toString();

  const url = `?${urlParams}`;

  try {
    // Utilizar instancia de Axios optimizada
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(
      `Error al consultar la categoría ${categoryId}:`,
      error.message
    );

    // Reintento opcional en caso de error transitorio
    if (error.response && error.response.status >= 500) {
      console.log('Reintentando consulta...');
      try {
        const retryResponse = await axiosInstance.get(url);
        return retryResponse.data;
      } catch (retryError) {
        console.error('Error en el reintento:', retryError.message);
        throw retryError;
      }
    }

    throw error;
  }
};

export const fetchDiscoverNewsAV = async (id) => {
  return getNewsByCategoryId(id);
};

export const ConstAPIUrl = async () => {
  return apiBaseUrlAV;
};

// constants.js
export const ApiRestURL = apiBaseUrlAV;

export const getCategorias = async () => {
  const url = `https://noticieroaltavoz.com/wp-json/wp/v2/publicidad-app`;
  const response = await axios.get(url);
  const htmlContent = response.data[0].content.rendered;

  return extractImagesWithTheirSource(htmlContent);
};

export const getCategories = async () => {
  const response = await fetch('https://noticieroaltavoz.com/');
  const html = await response.text();
  const parsed = parse(html, {
    blockTextElements: {
      script: false,
      noscript: true,
      style: true,
      pre: true,
    },
  });

  const itemsLiMenu = parsed
    .querySelector('.elementor-element-6d3dfb1')
    ?.querySelectorAll('li');
  const textItems = Array.from(itemsLiMenu).map((item) =>
    item.textContent.trim()
  );

  const itemsLiMenu2 = parsed
    .querySelector('.elementor-element-70940b2')
    ?.querySelectorAll('li');
  const textItems2 = Array.from(itemsLiMenu2).map((item) =>
    item.textContent.trim()
  );

  const textItemsFinal = textItems.concat(textItems2);

  const arrayMenuWeb = textItemsFinal.map((element) => ({
    id: 1,
    title: element,
  }));

  const result = await fetch(
    'https://noticieroaltavoz.com/wp-json/wp/v2/categories?per_page=12'
  )
    .then((resp) => resp.json())
    .then((data) =>
      data.map((item) => ({
        id: item.id,
        title: item.name,
      }))
    );

  const arrayCategoriasApi = result;

  const arrayCategory = [];

  arrayMenuWeb.forEach((menuWebItem) => {
    const categoriaEncontrada = arrayCategoriasApi.find(
      (categoriaApi) => categoriaApi.title === menuWebItem.title
    );

    if (categoriaEncontrada) {
      if (categoriaEncontrada.id === 331) {
        arrayCategory.splice(2, 0, categoriaEncontrada);
      } else {
        arrayCategory.push(categoriaEncontrada);
      }
    }
  });

  return arrayCategory;
};

export const getPublicidad = async () => {
  const url = `https://noticieroaltavoz.com/wp-json/wp/v2/publicidad-app`;
  const response = await axios.get(url);
  const htmlContent = response.data[0].content.rendered;

  return extractImagesWithTheirSource(htmlContent);
};
