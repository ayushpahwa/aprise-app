import { NavigationContainer } from '@react-navigation/native';

import { AuthStack } from 'screens/Root';

import TransactionContextProvider from 'store/TransactionsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <TransactionContextProvider>
          <AuthStack />
        </TransactionContextProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
