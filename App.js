/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */

// func excel - 25-sep - 6:47 pm
// func excel - 09-oct - 9:34 am

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { LogLevel, OneSignal } from 'react-native-onesignal';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import AppNavigation from './src/navigation';

const queryClient = new QueryClient();

// OneSignal.Debug.setLogLevel(LogLevel.Verbose);
// OneSignal.initialize('8497271c-4edb-486f-a683-063bd6205b5b');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
  }
}

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
