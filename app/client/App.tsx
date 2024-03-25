import { NavigationContainer } from '@react-navigation/native';

import { AuthStack } from 'screens/Root';

import TransactionContextProvider from 'store/TransactionsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

const queryClient = new QueryClient();

export default function App() {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <TransactionContextProvider>
            <AuthStack />
          </TransactionContextProvider>
        </ApplicationProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
