import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import AppNavigation from './src/navigation';
import { navigate } from './src/navigation/RootNavigation'; // Importa navigate global

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('8497271c-4edb-486f-a683-063bd6205b5b');
    OneSignal.Notifications.requestPermission(true);

    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('OneSignal: notification clicked:');

      const url = event.notification?.additionalData?.post_url;

      const EnlaceURL = {
        link: event.notification.additionalData.post_url,
      };

      console.log('OneSignal: URL:');
      console.log(url);

      const tituloCategoria = 'Portada-Migben';

      if (url) {
        // Usa navigate global, no useNavigation
        navigate('NewsDetails', {
          item: EnlaceURL,
          tituloCategoria,
        });
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
