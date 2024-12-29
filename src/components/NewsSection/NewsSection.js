import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

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

export function RenderNewsItem({
  item,
  tituloCategoria,
  indexso,
  activeCategoryId,
  showTag,
}) {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const handleClick = (data) => {
    /*
    console.log('data News Section');
    console.log('');
    console.log(data);
    */

    navigation.navigate('NewsDetails', {
      item: data,
      tituloCategoria,
    });
  };

  const tagArrayCategoria =
    item.yoast_head_json.schema['@graph'][0].articleSection;

  const tagArray2Categoria = tagArrayCategoria;
  const tagArray3Categoria = tagArray2Categoria.filter(
    (elemento) => elemento !== 'Portada'
  );
  // Unir las palabras con espacios
  const tagCategoria = tagArray3Categoria.join(', ');

  if (!fontsLoaded) {
    return <Text />;
  }

  return (
    <TouchableOpacity
      // className="mb-4 mt-2"
      key={item.id}
      onPress={() => handleClick(item)}
      style={{
        padding: 10,
      }}
    >
      <View
        // className={`ml-4 mr-4 ${activeCategoryId === 77 && indexso !== 0 ? 'flex-row' : null}`}
        style={{
          // backgroundColor: activeCategoryId === "77" ? 'red' : 'cyan',
          flexDirection:
            indexso !== 0 && activeCategoryId === '77' ? 'row' : 'column',
          width: indexso !== 0 && activeCategoryId === '77' ? '45%' : '100%',
        }}
      >
        <Image
          // className={`mb-2 rounded-md ${indexso !== 0 ? 'w-[90%] h-20' : 'w-[100%] h-64'}`}
          style={{
            width: '100%',
            height: indexso !== 0 && activeCategoryId === '77' ? 115 : 256,
            borderRadius: indexso !== 0 && activeCategoryId === '77' ? 12 : 20,
          }}
          source={{
            uri:
              item && item.yoast_head_json && item.yoast_head_json.og_image[0]
                ? item.yoast_head_json.og_image[0].url
                : '',
          }}
        />

        <View
          // className={`${activeCategoryId === 77 && indexso !== 0 ? 'w-[60%] ml-2' : null}`}
          style={{
            // backgroundColor: 'yellow',
            marginLeft: 10,
            width: '99%',
          }}
        >
          <Text
            // className="leading-[2rem]"
            className="py-0 px-2"
            style={{
              display:
                activeCategoryId === '77' && indexso === 0 && showTag === 0
                  ? 'flex'
                  : 'none',
              fontSize: 14,
              fontFamily: 'Poppins_500Medium',
              backgroundColor: '#0303B2',
              color: 'white',
              marginTop: 15,
              borderRadius: 2,
              alignSelf: 'flex-start',
            }}
          >
            {/* ................ ETIQUETA AZUL  ................   */}
            {/* {showTag}
            { '---' } */}
            {tagCategoria}
          </Text>

          <Text
            // className="leading-[2rem]"
            style={{
              fontSize: indexso !== 0 && activeCategoryId === '77' ? 14 : 24,
              fontFamily: 'Poppins_600SemiBold',
              textAlign: 'left',
              lineHeight: indexso !== 0 && activeCategoryId === '77' ? 16 : 26,
              paddingTop: indexso !== 0 && activeCategoryId === '77' ? 0 : 22,
              width:
                indexso !== 0 && activeCategoryId === '77' ? '120%' : '99%',
            }}
          >
            {/* {console.log('NewsSection')} */}
            {/* {item.id} ... */}
            {item.title.rendered}
          </Text>

          <Text
            className="font-bold text-gray-900 dark:text-black"
            style={{
              fontFamily: 'Poppins_500Medium',
              fontSize: hp(1.7),
              // backgroundColor: 'red',
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
}

export default function NewsSection({
  data,
  isRefreshing,
  onRefresh,
  tituloCategoria,
  activeCategoryId,
}) {
  return (
    <FlatList
      nestedScrollEnabled
      data={data}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <RenderNewsItem
          item={item}
          tituloCategoria={tituloCategoria}
          activeCategoryId={activeCategoryId}
        />
      )}
      ListFooterComponent={<SafeAreaView edge={['bottom']} />}
      // Agrega RefreshControl para "Pull to Refresh"
      refreshControl={
        <RefreshControl
          progressViewOffset={170}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={['#0303B2']} // Personaliza el color del indicador
        />
      }
    />
  );
}
