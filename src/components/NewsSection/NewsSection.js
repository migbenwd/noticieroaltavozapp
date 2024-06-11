import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
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
}) {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const handleClick = (data) => {
    navigation.navigate('NewsDetails', {
      item: data,
      tituloCategoria,
    });
  };
 
  const tagArrayCategoria = item.yoast_head_json.schema['@graph'][0].articleSection;
  const tagArray2Categoria = tagArrayCategoria;
  const tagArray3Categoria = tagArray2Categoria.filter(elemento => elemento !== "Portada");
  // Unir las palabras con espacios
  const tagCategoria = tagArray3Categoria.join(", ");

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
          flexDirection: indexso !== 0 ? 'row' : 'column',
          width: indexso !== 0 ? '45%' : '100%',
        }}
      >
        <Image
          // className={`mb-2 rounded-md ${indexso !== 0 ? 'w-[90%] h-20' : 'w-[100%] h-64'}`}
          style={{
            width: '100%',
            height: indexso !== 0 ? 125 : 256,
            borderRadius: indexso !== 0 ? 12 : 20,
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
            width: indexso !== 0 ? 180 : 325,
            // backgroundColor: 'red',
            marginLeft: 10,
          }}
        >
          <Text
            // className="leading-[2rem]"
            style={{
              display:
                activeCategoryId === '77' && indexso === 0 ? 'flex' : 'none',
              fontSize: 14,
              fontFamily: 'Poppins_500Medium',
              textAlign: 'center',
              backgroundColor: '#0303B2',
              width: '100%',
              color: 'white',
              marginTop: 15,
              borderRadius: 2,
            }}
          >
            {tagCategoria}
          </Text>

          <Text
            // className="leading-[2rem]"
            style={{
              fontSize: indexso !== 0 ? 14 : 24,
              // fontWeight: indexso !== 0 ? '600' : '800',
              fontFamily: 'Poppins_600SemiBold',
              textAlign: 'left',
              lineHeight: indexso !== 0 ? 16 : 26,
              paddingTop: indexso !== 0 ? 0 : 22,
            }}
          >
            {/* {console.log('NewsSection')} */}
            {/* {item.id} ... */}
            {item.title.rendered}
          </Text>

          <Text
            className="font-bold text-gray-900 dark:text-neutral-300"
            style={{
              fontFamily: 'Poppins_500Medium',
              fontSize: hp(2),
            }}
          >
            <Text className="text-gray-500">Por</Text>
            <Text> </Text>
            {item.yoast_head_json.author}
            <Text
              className="text-gray-500"
              style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: hp(1.85),
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
  tituloCategoria,
  activeCategoryId,
}) {
  return (
    <FlatList
      nestedScrollEnabled
      data={data}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <RenderNewsItem
          item={item}
          tituloCategoria={tituloCategoria}
          indexso={index}
          activeCategoryId={activeCategoryId}
        />
      )}
      ListFooterComponent={<SafeAreaView edge={['bottom']} />}
    />
  );
}
