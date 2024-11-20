import React from 'react';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

function PantallaDestino() {
  const route = useRoute();
  const { item, tituloCategoria } = route.params;

  return <WebView source={{ uri: item }} />;
}

export default PantallaDestino;
