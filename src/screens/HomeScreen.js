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
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import Carousel from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import CategoriesCard from '../components/CategoriesCard';
import { getPublicidad, getNewsByCategoryId } from '../services/NewsApi';
import NewsSection from '../components/NewsSection/NewsSection';
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
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const { colorScheme } = useColorScheme();
  const [activeCategory, setActiveCategory] = useState(CATEGORY_DEFAULT);
  const [isLoading, setIsLoading] = useState(true);
  const [discoverNewsAV, setDiscoverNewsAV] = useState([]); // Noticias actuales
  const [newsPortada, setNewsPortada] = useState([]);
  const [adPublicidad, setadPublicidad] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // Indicador de "Pull to Refresh"

  const [textShown, setTextShown] = useState(false);

  // Funciones ---------------------------------

  function formatDate(isoDate) {
    const options = {
      // weekday: "short",
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, options);
  }

  const getTheFirstFiveNewsByCategories = async () => {
    const newsByCategoriesId = [CATEGORY_DEFAULT, ...categoriesData].map(
      async (category) => {
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

  const handleClick = (data, sectionTitle) => {
    const tituloCategoria = sectionTitle;

    navigation.navigate('NewsDetails', {
      item: data,
      tituloCategoria,
    });
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

        {activeCategory.id === CATEGORY_DEFAULT.id ? null : (
          <Text
            className="dark:text-black ml-2 mb-2 mt-4"
            style={{
              fontSize: 25,
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
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index, section }) => {
            // Encontrar el índice de la sección
            const sectionIndexRen = newsPortada.findIndex(
              (s) => s.title === section.title
            );

            const tagArrayCategoria =
              item.yoast_head_json.schema['@graph'][0].articleSection;

            const tagArray2Categoria = tagArrayCategoria;
            const tagArray3Categoria = tagArray2Categoria.filter(
              (elemento) => elemento !== 'Portada'
            );
            // Unir las palabras con espacios
            const tagCategoria = tagArray3Categoria.join(', ');

            // Mostrar el índice en la consola
            // console.log('Índice de la sección:', sectionIndex);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleClick(item, section.title)}
                style={{
                  padding: 10,
                }}
              >
                <View
                  style={{
                    flexDirection:
                      index !== 0 && activeCategory.id === '77'
                        ? 'row'
                        : 'column',
                    width:
                      index !== 0 && activeCategory.id === '77'
                        ? '45%'
                        : '100%',
                  }}
                >
                  <Image
                    style={{
                      width: '100%',
                      height:
                        index !== 0 && activeCategory.id === '77' ? 115 : 256,
                      borderRadius:
                        index !== 0 && activeCategory.id === '77' ? 12 : 20,
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

                  <Text
                    style={{
                      display:
                        sectionIndexRen === 0 &&
                        index === 0 &&
                        section.key === newsPortada[0].key
                          ? 'flex'
                          : 'none',
                      fontSize: 14,
                      fontFamily: 'Poppins_500Medium',
                      backgroundColor: '#0303B2',
                      color: 'white',
                      marginTop: 15,
                      borderRadius: 2,
                      alignSelf: 'flex-start',
                      padding: 7,
                    }}
                  >
                    {tagCategoria}
                  </Text>

                  <View
                    style={{
                      marginLeft: 10,
                      width: '99%',
                    }}
                  >
                    <Text
                      style={{
                        fontSize:
                          index !== 0 && activeCategory.id === '77' ? 14 : 24,
                        fontFamily: 'Poppins_600SemiBold',
                        textAlign: 'left',
                        lineHeight:
                          index !== 0 && activeCategory.id === '77' ? 16 : 26,
                        paddingTop:
                          index !== 0 && activeCategory.id === '77' ? 0 : 22,
                        width:
                          index !== 0 && activeCategory.id === '77'
                            ? '120%'
                            : '99%',
                      }}
                    >
                      {item.title.rendered}
                    </Text>
                    <Text
                      className="font-bold text-gray-900 dark:text-black"
                      style={{
                        fontFamily: 'Poppins_500Medium',
                        fontSize: hp(1.7),
                        marginTop: 10,
                      }}
                    >
                      <Text className="text-gray-500">Por</Text>
                      <Text> </Text>
                      {item.yoast_head_json.author}
                      <Text
                        className="text-gray-500"
                        style={{
                          fontFamily: 'Poppins_400Regular',
                          fontSize: hp(1.6),
                        }}
                      >
                        <Text>{' • '}</Text>
                        {formatDate(item.date)}
                      </Text>
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          renderSectionHeader={({ section }) => {
            // Encontrar el índice de la sección
            const sectionIndex = newsPortada.findIndex(
              (s) => s.title === section.title
            );

            return (
              <View
                className="flex-row"
                styles={{
                  display: activeCategory.id === '77' ? 'none' : 'flex',
                }}
              >
                <Text
                  className="bg-[#FFCC29] uppercase rounded ml-2 py-0 px-7 mt-0 mb-4"
                  style={{
                    display: sectionIndex === 0 ? 'none' : 'flex',
                    fontSize: hp(2),
                    fontFamily: 'Poppins_700Bold',
                  }}
                >
                  {section.title}
                </Text>
              </View>
            );
          }}
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
                  />
                </View>
              </>
            );
          }}
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
