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
} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  usePlaybackState,
  // useProgress,
  Event,
  State,
} from 'react-native-track-player';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { setupPlayer, addTracks } from '../../trackPlayerServices';

function NombreEmisora() {
  const [info, setInfo] = useState({});
  useEffect(() => {
    setTrackInfo();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
    if (event.state == State.nextTrack) {
      setTrackInfo();
    }
  });

  async function setTrackInfo() {
    const track = await TrackPlayer.getCurrentTrack();
    const info = await TrackPlayer.getTrack(track);
    setInfo(info);
  }

  return (
    <View>
      <Text style={styles.songTitle}>{info.title}</Text>
    </View>
  );
}

function Playlist() {
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);

  async function loadPlaylist() {
    const queue = await TrackPlayer.getQueue();
    setQueue(queue);
  }

  useEffect(() => {
    loadPlaylist();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
    if (event.state == State.nextTrack) {
      TrackPlayer.getCurrentTrack().then((index) => setCurrentTrack(index));
    }
  });

  function PlaylistItem({ index, isCurrent, logoemisora }) {
    function handleItemPress() {
      TrackPlayer.skip(index);
    }
    return (
      <TouchableOpacity onPress={handleItemPress}>
        <Image
          style={{
            resizeMode: 'contain',
            height: 120,
            width: 120,
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 1,
            borderRadius: 12,
            borderColor: 'gray',
            borderWidth: 1,

            ...{
              backgroundColor: isCurrent ? '#7070E7' : '#0404B2',
            },
          }}
          source={{
            uri: logoemisora,
          }}
        />
      </TouchableOpacity>
    );
  }

  async function handleShuffle() {
    const queue = await TrackPlayer.getQueue();
    await TrackPlayer.reset();
    queue.sort(() => Math.random() - 0.5);
    await TrackPlayer.add(queue);

    loadPlaylist();
  }

  return (
    <View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={styles.nombreAviso}>
          Escucha la <Text style={{ fontWeight: 'bold' }}> radio en vivo</Text>
        </Text>
      </View>

      <View style={styles.playlist}>
        <FlatList
          horizontal={false}
          numColumns={2}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          data={queue}
          renderItem={({ item, index }) => (
            <PlaylistItem
              index={index}
              title={item.title}
              logoemisora={item.artwork}
              isCurrent={currentTrack == index}
            />
          )}
        />
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NombreEmisora />
        <Controls onShuffle={handleShuffle} />
      </View>
    </View>
  );
}

function Controls({ onShuffle }) {
  const playerState = usePlaybackState();

  async function handlePlayPress() {
    if ((await TrackPlayer.getState()) === State.Playing) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();

    }
  }

  // console.log('playerState', playerState);
  // console.log('State.Playing', State.Playing);

  return (
    <View
      style={{
        flexDirection: 'row',
        // justifyContent: 'space-around',
        // backgroundColor: 'red',
        padding: 0,
      }}
    >
      <View style={styles.button}>
        <Icon
          name="arrow-left"
          size={25}
          color="white"
          onPress={() => TrackPlayer.skipToPrevious()}
        />
      </View>

      <View style={styles.button}>
        
      {/* {console.log('playerState 1', playerState)}
      {console.log('State.Playing', State.Playing)} */}

        <Icon
          // name="play"
          name={playerState === State.Playing ? 'pause' : 'play'}
          size={25}
          color="white"
          // eslint-disable-next-line react/jsx-no-bind
          onPress={handlePlayPress}
        />
      </View>

      <View style={styles.button}>
        <Icon
          name="arrow-right"
          size={25}
          color="white"
          onPress={() => TrackPlayer.skipToNext()}
        />
      </View>
    </View>
  );
}

export default function Radio() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const { colorScheme } = useColorScheme();

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

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

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
      <Playlist />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  songTitle: {
    fontSize: 20,
    marginBottom: 2,
    marginTop: 7,
    color: 'black',
    textAlign: 'center',
  },

  playlist: {
    marginTop: 0,
  },

  nombreAviso: {
    // backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    marginBottom: 5,
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