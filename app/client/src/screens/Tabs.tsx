import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import TransactionContextProvider from "store/TransactionsContext";
import Home from "./Home";
import Activities from "./Activities";
import Profile from "./Profile";
import Groups from "./Groups";
import type { TabsStackParamList } from "constants/types/navigationTypes";
import { ScreenNamesEnum } from "constants/types/navigationTypes";

const { Navigator, Screen } = createBottomTabNavigator<TabsStackParamList>();

function DummyComponentForModalTab() {
  return null;
}

export const Tabs = () => {
  return (
    <TransactionContextProvider>
      <Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2f95dc",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Screen
          component={Home}
          name={ScreenNamesEnum.TABS_HOME}
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons color={color} name="home" size={size} />
            ),
          }}
        />
        <Screen
          component={Activities}
          name={ScreenNamesEnum.TABS_ACTIVITIES}
          options={{
            title: "Activities",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                color={color}
                name="history"
                size={size}
              />
            ),
          }}
        />
        {/* Add tab which doesn't open a screen, just opens a modal */}
        <Screen
          component={DummyComponentForModalTab}
          listeners={({ navigation }) => {
            return {
              tabPress: (e) => {
                e.preventDefault();
                navigation.navigate(ScreenNamesEnum.ROOT_TRANSACTION_MODAL);
              },
            };
          }}
          name={ScreenNamesEnum.TABS_ADD}
          options={{
            title: "Add",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                color={color}
                name="plus"
                size={size * 1.35}
              />
            ),
            headerShown: false,
          }}
        />
        <Screen
          component={Groups}
          name={ScreenNamesEnum.TABS_GROUPS}
          options={{
            title: "Groups",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                color={color}
                name="account-group-outline"
                size={size}
              />
            ),
          }}
        />
        <Screen
          component={Profile}
          name={ScreenNamesEnum.TABS_PROFILE}
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                color={color}
                name="account-circle-outline"
                size={size}
              />
            ),
          }}
        />
      </Navigator>
    </TransactionContextProvider>
  );
};
