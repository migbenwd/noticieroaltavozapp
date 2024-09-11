/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import React from 'react';
import AppNavigation from './src/navigation';

//One Signal
import { LogLevel, OneSignal } from 'react-native-onesignal';
import Constants from 'expo-constants'

const queryClient = new QueryClient();

OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize(Constants.expoConfig.extra.oneSignalAppId);

// Also need enable notifications to complete OneSignal setup
OneSignal.Notifications.requestPermission(true);


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
