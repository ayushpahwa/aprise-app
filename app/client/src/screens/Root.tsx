import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './Auth/Login';
import SignupScreen from './Auth/Signup';
import { Tabs } from 'screens/Tabs';
import { Colors } from '../constants/styles';

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.primary_calm },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
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
