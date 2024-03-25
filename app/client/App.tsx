import { NavigationContainer } from '@react-navigation/native';

import { RootStack } from 'screens/Root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import AuthContextProvider from 'store/AuthContext';
import { preventAutoHideAsync } from 'expo-splash-screen';

// Prevent splash screen from auto hiding
preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <AuthContextProvider>
            <RootStack />
          </AuthContextProvider>
        </ApplicationProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
