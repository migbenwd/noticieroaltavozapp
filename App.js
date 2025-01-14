import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import AppNavigation from './src/navigation';
import { BuscarNoticiasPortadaData } from './src/services/InicioNews';

const queryClient = new QueryClient();

export default function App() {
  const { newsByCategory } = BuscarNoticiasPortadaData();

  useEffect(() => {
    console.log('NewsByCategory:', newsByCategory);
  }, [newsByCategory]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
