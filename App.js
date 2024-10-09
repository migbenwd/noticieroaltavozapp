/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */

// func excel - 25-sep - 6:47 pm
// func excel - 09-oct - 9:34 am

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogLevel, OneSignal } from 'react-native-onesignal';

import React from 'react';
import AppNavigation from './src/navigation';

const queryClient = new QueryClient();

export default function App() {
  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize('8497271c-4edb-486f-a683-063bd6205b5b');

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission

  // OneSignal.Notifications.requestPermission(false);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', (event) => {
    console.log('OneSignal: notification clicked:', event);
  });

  // OneSignal.Notifications.canRequestPermission();

  // await OneSignal.User.pushSubscription.getTokenAsync();

  const [OnesignalId, setOneSignalId] = useState('');

  async function GetTokenUser() {
    // const result = await OneSignal.User.pushSubscription.getTokenAsync();
    const OnesignalId = await OneSignal.User.getOnesignalId();
    setOneSignalId(OnesignalId);
    console.log(OnesignalId);
  }

  GetTokenUser();

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
