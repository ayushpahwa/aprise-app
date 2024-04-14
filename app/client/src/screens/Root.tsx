import React from "react";
import { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Tabs } from "screens/Tabs";
import { Colors } from "../constants/styles";
import AuthScreen from "./Auth";
import { AuthContext } from "store/AuthContext";
import { LocalStoreKeys, getDataFromLocalStore } from "store/localStore";
import { hideAsync } from "expo-splash-screen";
import ManageGroups from "./Groups/ManageGroups";
import type { RootStackParamList } from "constants/types/navigationTypes";
import { ScreenNamesEnum } from "constants/types/navigationTypes";
import GroupDetails from "./Groups/GroupDetails";
import { TransactionModal } from "components/TransactionModal";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { isAuthenticated, setToken } = useContext(AuthContext);

  useEffect(() => {
    async function getToken() {
      const storedToken = await getDataFromLocalStore(
        LocalStoreKeys.AUTH_TOKEN,
      );
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

  return (
    <>
      {isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
      <Toast />
    </>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.primary_calm },
      }}
    >
      <Stack.Screen component={AuthScreen} name={ScreenNamesEnum.ROOT_AUTH} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: Colors.background },
        headerShown: false,
      }}
    >
      <Stack.Screen component={Tabs} name={ScreenNamesEnum.ROOT_TABS} />
      {/* Group screens */}
      <Stack.Screen
        component={ManageGroups}
        name={ScreenNamesEnum.ROOT_MANAGE_GROUPS}
      />
      <Stack.Screen
        component={GroupDetails}
        name={ScreenNamesEnum.ROOT_GROUP_DETAILS}
      />
      {/* Transaction modal */}
      <Stack.Screen
        component={TransactionModal}
        name={ScreenNamesEnum.ROOT_TRANSACTION_MODAL}
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
          headerShown: false,
          gestureDirection: "vertical",
          contentStyle: { backgroundColor: "rgba(0, 0, 0, 0)" },
        }}
      />
    </Stack.Navigator>
  );
}
