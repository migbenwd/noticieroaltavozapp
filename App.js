/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */

// func excel - 25-sep - 6:47 pm
// func excel - 09-oct - 9:34 am
// func excel - 09-oct - 9:34 am
// probando en preview
// - probar generar preview y development
// funciona en modo DEVELOPMENT en celular REDMI (ELENA)
// corregido color gris en modo DARK y se ve bien en appetize.io
// Enero 2025

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { LogLevel, OneSignal } from 'react-native-onesignal';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import AppNavigation from './src/navigation';
//import { getPublicidad } from './src/services/NewsApi';
import { getPublicidad } from './src/services/InicioNews';

const queryClient = new QueryClient();
export default function App() {
  
  /*
  useEffect(() => {
    getInicioNews();
  }, []);
  */

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
