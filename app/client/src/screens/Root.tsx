import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Tabs } from 'screens/Tabs';
import { Colors } from '../constants/styles';
import AuthScreen from './Auth';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'store/AuthContext';
import { LocalStoreKeys, getDataFromLocalStore } from 'store/localStore';
import { hideAsync } from 'expo-splash-screen';

const Stack = createNativeStackNavigator();

export function RootStack() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { isAuthenticated, setToken } = useContext(AuthContext);

  useEffect(() => {
    async function getToken() {
      const storedToken = await getDataFromLocalStore(LocalStoreKeys.AUTH_TOKEN);
      if (storedToken) setToken(storedToken, false);
      setCheckingAuth(false);
    }
    getToken();
  }, []);

  useEffect(() => {
    if (!checkingAuth) {
      hideAsync();
    }
  }, [checkingAuth]);

  if (checkingAuth) return null;

  return isAuthenticated ? <AuthenticatedStack /> : <AuthStack />;
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.primary_calm },
      }}
    >
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
