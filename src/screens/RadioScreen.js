/* eslint-disable global-require */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RadioScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const { colorScheme } = useColorScheme();

  const radioStations = [
    {
      id: '1',
      url: 'https://streaming.shoutcast.com/radio-65',
      title: 'RADIO 65',
      artwork:
        'https://noticieroaltavoz.com/wp-content/uploads/2024/01/RADIO-65-BLANCO.png',
    },
    {
      id: '2',
      url: 'https://streaming.shoutcast.com/gs-la-super-estacion',
      title: 'LA GS SUPER ESTACIÓN',
      artwork:
        'https://noticieroaltavoz.com/wp-content/uploads/2024/01/LA-GS-BLANCO.png',
    },
    {
      id: '3',
      url: 'https://streaming.shoutcast.com/la-jl',
      title: 'LA JL',
      artwork:
        'https://noticieroaltavoz.com/wp-content/uploads/2024/01/LA-JL-BLANCO.png',
    },
    {
      id: '4',
      url: 'https://streaming.shoutcast.com/la-maxi-gml',
      title: 'LA MAXI GML',
      artwork:
        'https://noticieroaltavoz.com/wp-content/uploads/2024/01/A-MAXI-GML-1.png',
    },
    {
      id: '5',
      url: 'https://streaming.shoutcast.com/la-maxi',
      title: 'LA MAXI',
      artwork:
        'https://noticieroaltavoz.com/wp-content/uploads/2024/01/A-MAXI-LOGO-CONTORNO-BCO-1.png',
    },
  ];

  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stoppingAppPausesPlayback: true,
      capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
    });
  };

  const playbackState = usePlaybackState();
  const [currentStationIndex, setCurrentStationIndex] = useState(null);
  const [tituloEmisora, settituloEmisora] = useState(null);
  const [playStatus, setPlayStatus] = useState('PLAY');

  useEffect(() => {
    setupPlayer();
  }, []);

  const playStation = async (index) => {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: radioStations[index].id,
      url: radioStations[index].url,
      title: radioStations[index].title,
      artist: 'Live Stream',
    });
    await TrackPlayer.play();
    setCurrentStationIndex(index);
    settituloEmisora(radioStations[index].title);
    setPlayStatus('PAUSA');
  };

  const togglePlayPause = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
      setPlayStatus('PLAY');
    } else {
      await TrackPlayer.play();
      setPlayStatus('PAUSA');
    }
  };

  const nextStation = () => {
    const nextIndex = (currentStationIndex + 1) % radioStations.length;
    playStation(nextIndex);
  };

  const prevStation = () => {
    const prevIndex =
      (currentStationIndex - 1 + radioStations.length) % radioStations.length;
    playStation(prevIndex);
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

      <View className="items-center mb-2">
        <Text style={styles.nombreAviso}>
          Escucha la <Text style={{ fontWeight: 'bold' }}>radio en vivo</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.radioContainer}>
        {radioStations.map((station, index) => (
          <TouchableOpacity
            key={station.id}
            style={styles.stationBox}
            onPress={() => playStation(index)}
          >
            <Image
              source={{ uri: station.artwork }}
              style={styles.stationImage}
            />
            {/* <Text style={styles.stationTitle}>{station.title}</Text> */}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.stationTitle}>{tituloEmisora}</Text>
      <View style={styles.controls}>
        <View style={styles.button}>
          <Icon
            name="arrow-left"
            size={25}
            color="white"
            onPress={prevStation}
          />
        </View>

        <View style={styles.button}>
          <Icon
            name={playStatus === 'PAUSA' ? 'pause' : 'play'}
            size={25}
            color="white"
            onPress={togglePlayPause}
          />
        </View>

        <View style={styles.button}>
          <Icon
            name="arrow-right"
            size={25}
            color="white"
            onPress={nextStation}
          />
        </View>

        {/* <TouchableOpacity style={styles.button} onPress={togglePlayPause}>
          <Text style={styles.buttonText}>
            {playStatus}
          </Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'cyan',
    paddingTop: 10,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },

  nombreAviso: {
    // backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    marginBottom: 5,
  },

  stationBox: {
    borderRadius: 10,
    borderColor: 'red',
    padding: 10,
    margin: 5,
    alignItems: 'center',
    width: 140,
    height: 130,
    backgroundColor: 'blue',
  },
  stationImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  stationTitle: {
    fontSize: 20,
    marginBottom: 2,
    marginTop: 7,
    color: 'black',
    textAlign: 'center',
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  button: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
});

/*
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
*/
