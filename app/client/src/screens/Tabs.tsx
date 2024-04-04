import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TransactionContextProvider from 'store/TransactionsContext';
import Home from './Home';
import Activities from './Activities';
import { TransactionModal } from 'components/TransactionModal';
import Profile from './Profile';
import Groups from './Groups';

const { Navigator, Screen } = createBottomTabNavigator();

function DummyComponentForModalTab() {
  return null;
}

export const Tabs = () => {
  return (
    <>
      <TransactionModal />

      <TransactionContextProvider>
        <Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#2f95dc',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          <Screen
            name="Home"
            component={Home}
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" size={size} color={color} />,
            }}
          />
          <Screen
            name="Activities"
            component={Activities}
            options={{
              title: 'Activities',
              tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="history" size={size} color={color} />,
            }}
          />
          {/* Add tab which doesn't open a screen, just opens a modal */}
          <Screen
            name="Add"
            component={DummyComponentForModalTab}
            options={{
              title: 'Add',
              tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="plus" size={size} color={color} />,
            }}
          />
          <Screen
            name="Groups"
            component={Groups}
            options={{
              title: 'Groups',
              tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />,
            }}
          />
          <Screen
            name="Profile"
            component={Profile}
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />,
            }}
          />
        </Navigator>
      </TransactionContextProvider>
    </>
  );
};
