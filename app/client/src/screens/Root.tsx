import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Tabs } from 'screens/Tabs';
import { Colors } from '../constants/styles';
import AuthScreen from './Auth';

const Stack = createNativeStackNavigator();

export function AuthStack() {
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
      <Tabs />
    </Stack.Navigator>
  );
}
