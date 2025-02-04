/* eslint-disable global-require */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

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
  Event,
  State,
  usePlaybackState,
  useTrackPlayerEvents,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useKeepAwake } from 'expo-keep-awake';
import { setupPlayer, addTracks } from '../../trackPlayerServices';

export default function RadioScreen() {
  useKeepAwake();

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

  // const setupPlayer = async () => {
  //   await TrackPlayer.setupPlayer();
  //   await TrackPlayer.updateOptions({
  //     stoppingAppPausesPlayback: false,
  //     android: {
  //       appKilledPlaybackBehavior:
  //         AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
  //     },
  //     capabilities: [
  //       Capability.Play,
  //       Capability.Pause,
  //       Capability.SkipToNext,
  //       Capability.SkipToPrevious,
  //       Capability.Stop,
  //     ],
  //     compactCapabilities: [
  //       Capability.Play,
  //       Capability.Pause,
  //       Capability.SkipToNext,
  //       Capability.SkipToPrevious,
  //     ],
  //     notificationCapabilities: [
  //       Capability.Play,
  //       Capability.Pause,
  //       Capability.SkipToNext,
  //       Capability.SkipToPrevious,
  //     ],
  //     alwaysPauseOnInterruption: true,
  //   });
  // };

  const playbackState = usePlaybackState();
  const [currentStationIndex, setCurrentStationIndex] = useState(null);
  const [tituloEmisora, settituloEmisora] = useState(null);
  const [playStatus, setPlayStatus] = useState('PLAY');
  const [selectedIndexRadio, setSelectedIndexRadio] = useState(null);

  // useEffect(() => {
  //   setupPlayer();
  // }, []);

  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer();

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }

      setIsPlayerReady(isSetup);
    }

    setup();
  }, []);

  useTrackPlayerEvents(
    [
      Event.RemoteNext,
      Event.RemotePrevious,
      Event.RemotePlay,
      Event.RemotePause,
    ],
    (event) => {
      if (event.type === Event.RemoteNext) {
        nextStation();
      } else if (event.type === Event.RemotePrevious) {
        prevStation();
      } else if (event.type === Event.RemotePlay) {
        TrackPlayer.play();
        setPlayStatus('PAUSA');
      } else if (event.type === Event.RemotePause) {
        TrackPlayer.pause();
        setPlayStatus('PLAY');
      }
    }
  );

  const playStation = async (index) => {
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: radioStations[index].id,
      url: radioStations[index].url,
      title: radioStations[index].title,
      artist: 'Live Stream',
      artwork: radioStations[index].artwork,
    });
    await TrackPlayer.play();
    setCurrentStationIndex(index);
    setSelectedIndexRadio(index);
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
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View className="items-center mb-2 bg-white">
        <Image
          source={require('../../assets/images/welcome/logo.png')}
          style={{ resizeMode: 'contain', width: '60%' }}
        />
      </View>

      <View className="items-center mb-2">
        <Text style={styles.nombreAviso}>
          Escucha la <Text style={{ fontWeight: 'bold' }}>radio en vivo</Text>
        </Text>
      </View>

      <View style={styles.radioContainer}>
        {radioStations.map((station, index) => (
          <TouchableOpacity key={station.id} onPress={() => playStation(index)}>
            <Image
              source={{ uri: station.artwork }}
              style={{
                ...styles.stationImage,
                backgroundColor:
                  selectedIndexRadio === index ? '#7070E7' : '#0404B2',
              }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View className="items-center mt-1">
        <Text style={styles.nombreAviso}>{tituloEmisora}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={prevStation}>
          <Icon name="arrow-left" size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={togglePlayPause}>
          <Icon
            name={playStatus === 'PAUSA' ? 'pause' : 'play'}
            size={25}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={nextStation}>
          <Icon name="arrow-right" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  nombreAviso: {
    fontSize: 20,
    marginBottom: 0,
  },
  stationImage: {
    resizeMode: 'contain',
    height: 120,
    width: 120,
    margin: 5,
    borderRadius: 12,
    borderColor: 'gray',
    borderWidth: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#0303B2',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
});
