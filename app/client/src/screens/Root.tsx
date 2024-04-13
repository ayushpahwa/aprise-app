import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Tabs } from 'screens/Tabs';
import { Colors } from '../constants/styles';
import AuthScreen from './Auth';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'store/AuthContext';
import { LocalStoreKeys, getDataFromLocalStore } from 'store/localStore';
import { hideAsync } from 'expo-splash-screen';
import ManageGroups from './Groups/ManageGroups';
import { RootStackParamList, ScreenNamesEnum } from 'constants/types/navigationTypes';
import GroupDetails from './Groups/GroupDetails';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <Stack.Screen name={ScreenNamesEnum.ROOT_AUTH} component={AuthScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name={ScreenNamesEnum.ROOT_TABS}
        component={Tabs}
        options={{
          headerShown: false,
        }}
      />
      {/* Group screens */}
      <Stack.Screen name={ScreenNamesEnum.ROOT_MANAGE_GROUPS} component={ManageGroups} />
      <Stack.Screen
        name={ScreenNamesEnum.ROOT_GROUP_DETAILS}
        component={GroupDetails}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
