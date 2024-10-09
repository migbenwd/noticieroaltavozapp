/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */

// func excel - 25-sep - 6:47 pm
// func excel - 09-oct - 9:34 am

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import React from 'react';
import AppNavigation from './src/navigation';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
}
