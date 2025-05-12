import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import Router from './router';

// Crear el cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient} >
      <AuthProvider >
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;