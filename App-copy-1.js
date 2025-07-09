/*

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



// 2. ----------------------------------

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

    // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
    OneSignal.Notifications.requestPermission(true); // Changed to true to ensure permission is requested

    // 🔽 AÑADE ESTOS MANEJADORES DE EVENTOS AQUÍ 🔽

    // 1. Se ejecuta cuando el usuario HACE CLIC en una notificación
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('OneSignal: notification clicked:', event.notification);
    });

    // 2. Se ejecuta cuando se recibe una notificación y la app está en PRIMER PLANO
    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      (event) => {
        console.log(
          'OneSignal: notification will display in foreground:',
          event.getNotification()
        );

        // Permite que la notificación se muestre
        event.preventDefault();
        event.getNotification().display();
      }
    );

    // 🔼 FIN DE LOS MANEJADORES DE EVENTOS 🔼
  }, []); // Ensure this only runs once on app mount

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}

*/

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { OneSignal, LogLevel } from 'react-native-onesignal';

// Importa la función de navegación que creaste
import { useNavigation } from '@react-navigation/native';
import { navigate } from './src/navigation/RootNavigation';
import AppNavigation from './src/navigation';

const queryClient = new QueryClient();

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('8497271c-4edb-486f-a683-063bd6205b5b');
    OneSignal.Notifications.requestPermission(true);

    // 👇 MODIFICA ESTE EVENTO 👇
    OneSignal.Notifications.addEventListener('click', (event) => {
      // console.log('OneSignal: notification clicked:', event.notification);
      console.log('OneSignal: notification clicked:');

      // Extrae la URL de los datos adicionales de la notificación
      console.log('CUERPO PUSH NOTIFICATION - additionalData');
      console.log('........................');
      // console.log(event.notification);
      console.log(event.notification.additionalData.post_url);

      const url = event.notification.additionalData.post_url;

      /*
      if (navigationRef.isReady()) {
        navigationRef.current.navigate('NewsDetails', {
          item: EnlaceURL,
          tituloCategoria,
        });
      }
        */

      // Si la URL existe, navega a la pantalla de detalles
      /*
      if (url) {
        navigate('NewsDetails', { url });
      }
      });
      */

      const tituloCategoria = 'Portada';

      if (url) {
        navigation.navigate('NewsDetails', {
          item: url,
          tituloCategoria,
        });
      }
    });

    /*
    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      (event) => {
        console.log(
          'OneSignal: notification will display in foreground:',
          event.getNotification()
        );
        event.preventDefault();
        event.getNotification().display();
      }
    );
    */
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
