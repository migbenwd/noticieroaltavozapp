import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
} from 'react-native-track-player';

const radioStations = [
  {
    id: '1',
    url: 'https://streaming.shoutcast.com/radio-65',
    title: 'RADIO 65',
    duration: 66,
    artwork:
      'https://noticieroaltavoz.com/wp-content/uploads/2024/01/RADIO-65-BLANCO.png',
  },
  {
    id: '2',
    url: 'https://streaming.shoutcast.com/gs-la-super-estacion',
    title: 'LA GS SUPER ESTACIÓN',
    duration: 66,
    artwork:
      'https://noticieroaltavoz.com/wp-content/uploads/2024/01/LA-GS-BLANCO.png',
  },
  {
    id: '3',
    url: 'https://streaming.shoutcast.com/la-jl',
    title: 'LA JL',
    duration: 66,
    artwork:
      'https://noticieroaltavoz.com/wp-content/uploads/2024/01/LA-JL-BLANCO.png',
  },
  {
    id: '4',
    url: 'https://streaming.shoutcast.com/la-maxi-gml',
    title: 'LA MAXI GML',
    duration: 73,
    artwork:
      'https://noticieroaltavoz.com/wp-content/uploads/2024/01/A-MAXI-GML-1.png',
  },
  {
    id: '5',
    url: 'https://streaming.shoutcast.com/la-maxi',
    title: 'LA MAXI',
    duration: 73,
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

function RadioApp() {
  const playbackState = usePlaybackState();
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [playStatus, setPlayStatus] = useState('DETENIDO'); // Cambia el estado inicial a 'DETENIDO'

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
    setPlayStatus('SONANDO'); // Actualiza el estado a 'SONANDO' cuando se inicia la reproducción
  };

  const togglePlayPause = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
      setPlayStatus('DETENIDO'); // Actualiza el estado a 'DETENIDO' cuando se pausa
    } else {
      await TrackPlayer.play();
      setPlayStatus('SONANDO'); // Actualiza el estado a 'SONANDO' cuando se reanuda
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
    <View style={styles.container}>
      <Text style={styles.title}>Radio App</Text>
      <Text style={styles.stationTitle}>
        {radioStations[currentStationIndex].title}
      </Text>
      <Text style={styles.statusText}>{playStatus}</Text>
      {/* Nuevo texto para mostrar el estado actual */}
      <TouchableOpacity style={styles.button} onPress={togglePlayPause}>
        <Text style={styles.buttonText}>{playStatus}</Text>
        {/* Botón actualizado para mostrar 'SONANDO' o 'DETENIDO' */}
      </TouchableOpacity>
      <View style={styles.controls}>
        <TouchableOpacity onPress={prevStation} style={styles.button}>
          <Text style={styles.buttonText}>⏮️ Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextStation} style={styles.button}>
          <Text style={styles.buttonText}>Next ⏭️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  stationTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    backgroundColor: 'red',

  },
  button: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default RadioApp;
