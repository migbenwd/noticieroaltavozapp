/* eslint-disable global-require */

import React, { useEffect, useState } from 'react';
import {
  // SafeAreaView,
  // ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export default function Contact() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const { colorScheme } = useColorScheme();

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

      <View className="items-center pr-8 pl-8 pt-4 text-center">
        <Text style={styles.title}>Contáctenos</Text>

        <Text style={styles.description}>
          Todas nuestras noticias son generadas por un equipo de periodistas
          profesionales, comprometidos con la imparcialidad y la veracidad.
          Utilizamos fuentes confiables y verificadas para garantizar que estés
          siempre bien informado.
        </Text>

        <Text style={styles.label}>Teléfono:</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('tel:+52(668)1140769')}
        >
          <Text style={styles.link}>+52(668)1140769</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Correo Electrónico:</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('mailto:hola@grupochavezradio.com')}
        >
          <Text style={styles.link}>hola@grupochavezradio.com</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Sitio Web:</Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://noticieroaltavoz.com/contacto')
          }
        >
          <Text style={styles.link}>https://noticieroaltavoz.com/</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'blue',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 22,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    fontFamily: 'Poppins_400Regular',
  },
  link: {
    fontSize: 16,
    color: 'blue',
    marginTop: 5,
    fontFamily: 'Poppins_400Regular',
  },
  viewcontrol: {
    backgroundColor: 'red',
  },
});
