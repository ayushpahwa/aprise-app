import { NavigationContainer } from '@react-navigation/native';

import { AuthStack } from 'screens/Root';

import TransactionContextProvider from 'store/TransactionsContext';

export default function App() {
  return (
    <NavigationContainer>
      <TransactionContextProvider>
        <AuthStack />
      </TransactionContextProvider>
    </NavigationContainer>
  );
}
