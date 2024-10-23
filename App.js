/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */

// func excel - 25-sep - 6:47 pm
// func excel - 09-oct - 9:34 am

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { LogLevel, OneSignal } from 'react-native-onesignal';

import React from 'react';
import AppNavigation from './src/navigation';

const queryClient = new QueryClient();

// OneSignal.Debug.setLogLevel(LogLevel.Verbose);
// OneSignal.initialize('8497271c-4edb-486f-a683-063bd6205b5b');

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
