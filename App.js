/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-unstable-nested-components */


import AppNavigation from "./src/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

import React from "react";

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigation />
    </QueryClientProvider>
  );
} 