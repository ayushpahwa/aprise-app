import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TransactionContextProvider, { TransactionContext } from 'store/TransactionsContext';
import Home from './Home';
import Details from './Details';
import { TransactionModal } from 'components/TransactionModal';

const { Navigator, Screen } = createBottomTabNavigator();

function DummyComponentForModalTab() {
  return null;
}

export const Tabs = () => {
  const { ui } = useContext(TransactionContext);
  return (
    <>
      <TransactionModal />

      <Navigator>
        <Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} />,
          }}
        />
        {/* Add tab which doesn't open a screen, just opens a modal */}
        <Screen
          name="Add"
          component={DummyComponentForModalTab}
          options={{
            title: 'Add',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="plus" size={24} color={color} />,
          }}
          listeners={() => ({
            tabPress: (e) => {
              e.preventDefault();
              // Open the modal
              ui.openModal();
            },
          })}
        />
        <Screen
          name="AllExpenses"
          component={Details}
          options={{
            title: 'All Expenses',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="format-list-bulleted" size={24} color={color} />,
          }}
        />
      </Navigator>
    </>
  );
};
