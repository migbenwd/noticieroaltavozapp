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
  FlatList,
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
import { getPublicidad, getNewsByCategoryId } from '../services/NewsApi';
import NewsSection, {
  RenderNewsItem,
} from '../components/NewsSection/NewsSection';
import { openInBrowser } from '../utils/openInBrowser';
import categoriesData from '../components/categoria-lista.json'; // Ajusta la ruta si es necesario

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

const renderItemPublicidad = ({ item }) => {
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

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const { colorScheme } = useColorScheme();
  const [activeCategory, setActiveCategory] = useState(CATEGORY_DEFAULT);
  const [isLoading, setIsLoading] = useState(true);
  const [discoverNewsAV, setDiscoverNewsAV] = useState([]); // Noticias actuales
  const [newsPortada, setNewsPortada] = useState([]);
  const [adPublicidad, setadPublicidad] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // Indicador de "Pull to Refresh"

  // Funciones ---------------------------------

  const getTheFirstFiveNewsByCategories = async () => {
    console.log('entró a BUSCAR 5 NOTICIAS');
    // const categories = await getCategories();
    const newsByCategoriesId = [CATEGORY_DEFAULT, ...categoriesData].map(
      async (category) => {
        // console.log('category.id');
        // console.log(category.id);

        const news = await getNewsByCategoryId(category.id, 5);
        return {
          title: category.title,
          id: category.id,
          // data: news.slice(0, 5),
          data: news,
        };
      }
    );

    return Promise.all(newsByCategoriesId);
  };

  function fetchNewsByCategory(categoryId) {
    setIsLoading(true);

    if (categoryId === CATEGORY_DEFAULT.id) {
      return getTheFirstFiveNewsByCategories().then((data) => {
        // console.log(data);
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
  }, []); // Agregar la función como dependencia

  // Función para el "Pull to Refresh"
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNewsByCategory(activeCategory.id);
    setIsRefreshing(false);
  };

  if (!fontsLoaded) {
    return <Text />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edge={['bottom']}>
      <View className="flex-row justify-between items-center px-2 pb-12 bg-[#0303B2]" />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View className="items-center mb-2 bg-white">
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
        <Text
          className="dark:text-black ml-2 mb-2 mt-4"
          style={{
            fontSize: 19,
            fontFamily: 'Poppins_700Bold',
          }}
        >
          {activeCategory.title}
        </Text>
      </View>

      {isLoading ? (
        <View className="mt-8 flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : activeCategory.id === CATEGORY_DEFAULT.id ? (
        <SectionList
          sections={newsPortada}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => (
            <View>
              <Image
                // className={`mb-2 rounded-md ${indexso !== 0 ? 'w-[90%] h-20' : 'w-[100%] h-64'}`}
                style={{
                  width: '100%',
                  height: 256,
                  borderRadius: 20,
                }}
                source={{
                  uri:
                    item &&
                    item.yoast_head_json &&
                    item.yoast_head_json.og_image[0]
                      ? item.yoast_head_json.og_image[0].url
                      : '',
                }}
              />
              <Text style={{ marginBottom: 11 }}>{item.title.rendered}</Text>
              <Text style={{ marginBottom: 11 }}>{index}</Text>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View>
              <Text style={{ backgroundColor: 'blue' }}>{title}</Text>
              {/* <Carousel
                data={adPublicidad}
                renderItem={renderItemPublicidad}
                sliderWidth={slideWidth}
                itemWidth={itemWidth}
                hasParallaxImages
                containerCustomStyle={styles.slider}
                loop
                loopClonesPerSide={2}
                autoplay
                autoplayDelay={500}
                autoplayInterval={3000}
              /> */}
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
