/* eslint-disable global-require */

// migbenr
// migben 01-05-2024 - 11:13 am
// migben 25-11-2024 - 4:18 pm

import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import Carousel from 'react-native-snap-carousel';
import { set } from 'lodash';
import CategoriesCard from '../components/CategoriesCard';
import NewsSection, {
  RenderNewsItem,
} from '../components/NewsSection/NewsSection';

import {
  getNewsByCategoryId,
  getCategories,
  getPublicidad,
} from '../services/NewsApi';

import { openInBrowser } from '../utils/openInBrowser';

const { width } = Dimensions.get('screen');
function wp(percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const CATEGORY_DEFAULT = { id: '77', title: 'Portada' };

const getTheFirstFiveNewsByCategories = async () => {
  const categories = await getCategories();

  // Crear una copia y agregar el elemento al inicio
  /*
  const newArray = [CATEGORY_DEFAULT].concat(categories);
  const newArrayCategoria = newArray.map((item) => ({
    page: 1,
    ...item,
  }));
  */

  const newsByCategoriesId = [CATEGORY_DEFAULT, ...categories].map(
    async (category) => {
      const news = await getNewsByCategoryId(category.id);
      return {
        title: category.title,
        id: category.id,
        data: news.slice(0, 5),
      };
    }
  );

  return Promise.all(newsByCategoriesId);
};

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const { colorScheme } = useColorScheme();
  const [activeCategory, setActiveCategory] = useState(CATEGORY_DEFAULT);
  const [isLoading, setIsLoading] = useState(true);
  const [discoverNewsAV, setDiscoverNewsAV] = useState([]); // Noticias Actuales
  const [isRefreshing, setIsRefreshing] = useState(false); // Indicador de "Pull to Refresh"
  const [newsPortada, setNewsPortada] = useState([]);
  const [adPublicidad, setadPublicidad] = useState([]);
  const [page, setPage] = useState(1);

  const [categoriasNoticiasPage, setcategoriasNoticiasPage] = useState([]);

  function fetchNewsByCategory(categoryId) {
    setIsLoading(true);

    if (categoryId === CATEGORY_DEFAULT.id) {
      return getTheFirstFiveNewsByCategories().then((data) => {
        setIsLoading(false);
        setNewsPortada(data);
      });
    }

    getNewsByCategoryId(categoryId)
      .then((data) => {
        setIsLoading(false);
        setDiscoverNewsAV(data);
      })
      .catch((err) => {
        console.log('Error fetching news by category id', err);
      });
  }

  const handleChangeCategory = (category) => {
    console.log('cambio categoria en SLIDER CATEGORIES');
    console.log('La el ID es ahora ', category.id);

    setDiscoverNewsAV([]);
    setActiveCategory(category);
    fetchNewsByCategory(category.id);
  };

  useEffect(() => {
    getPublicidad().then(setadPublicidad);
    fetchNewsByCategory(CATEGORY_DEFAULT.id);
  }, []);

  function buscarPageEnCategorias(categoryid) {
    // const findPageById = (categoryid) => {

    const [category] = categoriasNoticiasPage; // Assuming a single category array

    const foundCategory = category.find((item) => item.id === categoryid);

    return foundCategory ? foundCategory.page : null; // Return null if not found

    // };

    // Example usage:
    /*
    const idToFind = categoryid;
    const pageValue = findPageById(idToFind);
    */

    /*
    const actualizarPagePorId = (idCat) => {
      const nuevasCategorias = categoriasNoticiasPage.map((categoria) => {
        return categoria.map((item) => {
          if (item.id === idCat) {
            return { ...item, page: item.page + 1 }; // Incrementa el valor de page
          }
          return item;
        });
      });

      setcategoriasNoticiasPage(nuevasCategorias);
      console.log(
        'Se actualizaron valores de PAGE en buscarPageEnCategorias en el NUEVO ARRAY, y son los siguientes'
      );
      console.log(nuevasCategorias);
    };

    actualizarPagePorId(categoryid);
    */
  }

  // ------------------- INCREMENTAR VALOR DE PAGE EN CATEGORIA CORRESPONDIENTE - SEGUN ID CAT  --------------------------//

  function actualizarValorPageEnCategorias(cat_id, suma) {
    console.log('el valor de suma es: ', suma);
    const nuevasCategorias = categoriasNoticiasPage.map((categoria) => {
      // const nuevoPage = page;
      return categoria.map((item) => {
        if (item.id === cat_id) {
          // return { ...item, page: item.page + 1 }; // Incrementa el valor de page
          return { ...item, page: suma }; // Incrementa el valor de page
        }
        return item;
      });
    });

    setcategoriasNoticiasPage(nuevasCategorias);
    console.log('Array actualizado en actualizarValorPageEnCategorias: ');
    console.log(categoriasNoticiasPage);
  }

  // ------------------- Creo Array para Poder Paginar Categorias  --------------------------//

  const fetchCategorias = async () => {
    try {
      const categorias_noticias = await getCategories();
      const newArray1 = [CATEGORY_DEFAULT].concat(categorias_noticias);
      const newArrayCategoria = newArray1.map((item) => ({
        page: 1,
        ...item,
      }));

      setcategoriasNoticiasPage([newArrayCategoria]);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  /* ---------------------------------------------------------------------------------------- */

  // Función para obtener datos de la API
  const fetchNews = async () => {
    try {
      console.log('Entró a fetchNews y el ID de categoria es...');
      console.log(activeCategory.id);

      const paginaCat = parseInt(buscarPageEnCategorias(activeCategory.id));
      console.log('paginaCat');
      console.log(paginaCat);

      // Actualiza SetPage
      setPage(1);
      const sumaPage = page + paginaCat;

      console.log('Ahora page vale: ');
      console.log(sumaPage);

      actualizarValorPageEnCategorias(activeCategory.id, sumaPage);

      const response = await fetch(
        `https://noticieroaltavoz.com/wp-json/wp/v2/posts/?categories=${activeCategory.id}&page=${page}`
      );

      const result = await response.json();
      setDiscoverNewsAV([...result, ...discoverNewsAV]);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  // Llama a la API al cargar la pantalla
  useEffect(() => {
    console.log('Cargando Pantalla SIN HACER PULL TO REFRESH');
    fetchNews();
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, []);

  // console.log('categoriasNoticiasPage...');
  // console.log(categoriasNoticiasPage);

  // Función para el "Pull to Refresh"
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // buscarPageEnCategorias(activeCategory.id);
    await fetchNews(); // Vuelve a llamar a la API para obtener datos nuevos
    setIsRefreshing(false);
  };

  if (!fontsLoaded) {
    return <Text />;
  }

  // -----------------------------------------------------------------------------
  /*
  const fetchBuscaValorPage = async () => {
    try {
      console.log('entra en funcion fetchBuscaValorPage...');

      const [category] = categoriasNoticiasPage; // Assuming a single category array

      const foundCategory = category.find((item) => item.id === activeCategory.id);

      // return foundCategory ? foundCategory.page : null; // Return null if not found

      setPage(foundCategory);
    } catch (error) {
      console.error('Error fetchBuscaValorPage:', error);
    }
  };
  */

  function fetchBuscaValorPage(id) {
    console.log('entró en fetchBuscaValorPage y el id es:', id);

    const [category] = categoriasNoticiasPage; // Assuming a single category array

    const foundCategory = category.find((item) => item.id === id);
    const Valorinx = parseInt(foundCategory.page);
    return Valorinx;
  }

  const renderItem = ({ item }) => {
    // -------------- item de publicidad

    // console.log('item de publicidad...');
    // console.log(item.puntoclick);

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={
          {
            // width: '80%',
          }
        }
        onPress={item.src === 'sin-url' ? null : () => openInBrowser(item.src)} // Only set onPress if enabled
      >
        <Image
          source={{ uri: item.image }}
          style={{ aspectRatio: 4 / 3, flex: 1 }}
          // resizeMode="repeat"
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edge={['bottom']}>
      <View className="flex-row justify-between items-center px-2 pb-12 bg-[#0303B2]" />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View className="items-center mb-2  bg-white">
        <Image
          source={require('../../assets/images/welcome/logo.png')}
          style={{
            resizeMode: 'contain',
            width: '60%',
          }}
        />
      </View>

      <View className="p-2">
        <CategoriesCard
          activeCategory={activeCategory.id}
          handleChangeCategory={handleChangeCategory}
        />

        {activeCategory.id === CATEGORY_DEFAULT.id ? null : (
          <Text
            className="dark:text-white ml-2 mb-2 mt-4"
            style={{
              fontSize: hp(3.25),
              fontFamily: 'Poppins_700Bold',
            }}
          >
            {activeCategory.title}
          </Text>
        )}
      </View>
      {isLoading ? (
        <View className="mt-8 flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : activeCategory.id === CATEGORY_DEFAULT.id ? (
        <SectionList
          sections={newsPortada}
          keyExtractor={(item) => item.id}
          renderSectionFooter={({
            section: { id: categoryId, title: categoryTitle },
          }) => {
            return (
              <>
                <TouchableOpacity
                  onPress={() =>
                    handleChangeCategory({
                      id: categoryId,
                      title: categoryTitle,
                    })
                  }
                  className="flex items-center space-y-1"
                >
                  <View
                    className="mb-6 py-2 px-4 border-2 bg-slate-50  w-50"
                    style={{ borderRadius: 50 }}
                  >
                    <Text
                      style={{
                        fontSize: hp(2),
                        fontFamily: 'Poppins_400Regular',
                      }}
                    >
                      Ver Más
                    </Text>
                  </View>
                </TouchableOpacity>
                <View
                  className="mb-10"
                  style={{
                    // backgroundColor: 'red',
                    alignItems: 'center',
                  }}
                >
                  <Carousel
                    data={adPublicidad}
                    renderItem={renderItem}
                    sliderWidth={slideWidth}
                    itemWidth={itemWidth}
                    hasParallaxImages
                    containerCustomStyle={styles.slider}
                    loop
                    loopClonesPerSide={2}
                    autoplay
                    autoplayDelay={500}
                    autoplayInterval={3000}
                  />
                </View>
              </>
            );
          }}
          renderItem={({ item, index }) => (
            <RenderNewsItem
              item={item}
              tituloCategoria={activeCategory.title}
              activeCategoryId={activeCategory.id}
              indexso={index}
              showTag={newsPortada.findIndex((objeto) =>
                objeto.data.includes(item)
              )}
              index={index}
            />
          )}
          renderSectionHeader={({ section: { title, id } }) => (
            // -------------- category tittle
            <View
              className="flex-row"
              style={{
                display: id === '77' ? 'none' : 'flex',
              }}
            >
              <Text
                className="bg-[#FFCC29] uppercase rounded ml-2 py-0 px-7 mt-0 mb-4"
                style={{
                  fontSize: hp(2),
                  fontFamily: 'Poppins_700Bold',
                }}
              >
                {title}
              </Text>
            </View>
          )}
        />
      ) : (
        <NewsSection
          data={discoverNewsAV}
          tituloCategoria={activeCategory.title}
          activeCategoryId={activeCategory.id}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  //   container: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     justifyContent: 'space-around',
  //     alignItems: 'center',
  //     height: '10%',
  //     textAlign: 'center',
  //     backgroundColor: 'white',
  //   },
  slider: {
    overflow: 'hidden',
  },
});
