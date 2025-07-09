import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import React, { useEffect } from 'react';
// Include the OneSignal package
import { OneSignal, LogLevel } from 'react-native-onesignal';
import AppNavigation from './src/navigation';

const queryClient = new QueryClient();

export default function App() {
  // Initialize OneSignal in useEffect to ensure it runs only once
  useEffect(() => {
    // Enable verbose logging for debugging (remove in production)
     OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    // Initialize with your OneSignal App ID
    OneSignal.initialize('8497271c-4edb-486f-a683-063bd6205b5b');
    // Use this method to prompt for push notifications.
    // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
    OneSignal.Notifications.requestPermission(false);
  }, []); // Ensure this only runs once on app mount

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
