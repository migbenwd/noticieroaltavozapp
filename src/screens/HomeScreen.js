import React, { useEffect, useState, useCallback, useContext } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import Carousel from 'react-native-snap-carousel';
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

import { NewsContext, NewsProvider } from './NewsContext';

const { width, height } = Dimensions.get('screen');
function wp(percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}
function hp(percentage) {
  const value = (percentage * height) / 100;
  return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const itemWidth = slideWidth + itemHorizontalMargin * 2;

const CATEGORY_DEFAULT = { id: '77', title: 'Portada' };

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const { colorScheme } = useColorScheme();
  const [activeCategory, setActiveCategory] = useState(CATEGORY_DEFAULT);
  const [isLoading, setIsLoading] = useState(true);
  const [discoverNewsAV, setDiscoverNewsAV] = useState([]); // Noticias actuales
  const [isRefreshing, setIsRefreshing] = useState(false); // Indicador de "Pull to Refresh"
  const [newsPortada, setNewsPortada] = useState([]);
  const [adPublicidad, setadPublicidad] = useState([]);

  const { newsData, loading } = useContext(NewsContext);

  const getTheFirstFiveNewsByCategories = useCallback(async () => {
    const categories = await getCategories();

    // Extrae los valores de "id" de las categorías
    const categoryIds = categories.map((category) => category.id);

    // Muestra los valores de "id" en consola
    console.log('Category IDs:', categoryIds);

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
  }, []);

  function fetchNewsByCategory(categoryId) {
    setIsLoading(true);
    if (categoryId === CATEGORY_DEFAULT.id) {
      return getTheFirstFiveNewsByCategories().then((data) => {
        setIsLoading(false);
        setNewsPortada(data);
      });
    }
    getNewsByCategoryId(categoryId, 10)
      .then((data) => {
        setIsLoading(false);
        setDiscoverNewsAV(data);
      })
      .catch((err) => {
        console.log('Error fetching news by category id', err);
      });
  }

  const handleChangeCategory = (category) => {
    setActiveCategory(category);
    fetchNewsByCategory(category.id);
  };

  useEffect(() => {
    fetchNewsByCategory(CATEGORY_DEFAULT.id);
    getPublicidad().then(setadPublicidad);
  }, [getTheFirstFiveNewsByCategories]); // Agregar la función como dependencia

  // Función para el "Pull to Refresh"
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNewsByCategory(activeCategory.id);
    setIsRefreshing(false);
  };

  if (!fontsLoaded) {
    return <Text />;
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={item.src === 'sin-url' ? null : () => openInBrowser(item.src)}
      >
        <Image
          source={{ uri: item.image }}
          style={{ aspectRatio: 4 / 3, flex: 1 }}
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
            className="dark:text-black ml-2 mb-2 mt-4"
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
          initialNumToRender={3}
          maxToRenderPerBatch={3}
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
  slider: {
    overflow: 'hidden',
  },
});
