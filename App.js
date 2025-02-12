import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';

import { AppState } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import AppNavigation from './src/navigation';

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        TrackPlayer.play(); // Asegura que la radio continúe en segundo plano
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
