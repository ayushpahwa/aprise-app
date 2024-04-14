import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import type {
  RootStackParamList,
  ScreenNamesEnum,
} from "constants/types/navigationTypes";
import { QUERY_KEYS } from "api/ApiConstants";
import type { RouteProp } from "@react-navigation/native";
import type { Group } from "api/GroupsAPI";
import GroupsAPI from "api/GroupsAPI";
import type { ApiResponse } from "constants/types/apiTypes";
import { Card } from "@ui-kitten/components";
import { defaultStyles } from "constants/styles";
import BackButton from "components/ui/BackButton";
import SettingsButton from "components/ui/SettingsButton";
import { TransactionsList } from "components/TransactionList";

interface Iprops {
  route: RouteProp<RootStackParamList, ScreenNamesEnum.ROOT_GROUP_DETAILS>;
}

const GroupDetails = ({ route }: Iprops) => {
  // Get groupId from route params
  const { groupId } = route.params;

  // Get group details from already fetched groups list using useQuery hook
  const { data: groupsList } = useQuery<ApiResponse<Group[]>>({
    queryKey: [QUERY_KEYS.FETCH_GROUPS],
  });

  // Fetch group details using groupId
  const {
    data: groupTxnList,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_GROUP_DETAILS, groupId],
    queryFn: async () => await GroupsAPI.getGroupTransactions(groupId),
    enabled: !!groupId,
    refetchOnMount: true,
  });

  // Find the group with groupId
  const group = useMemo(() => {
    if (!!groupsList && !!groupsList.data) {
      return groupsList.data.find((group: any) => group.id === groupId);
    }
  }, [groupId, groupsList]);

  const transactions = useMemo(() => {
    if (!isError && !isLoading && !!groupTxnList && !!groupTxnList.data) {
      return groupTxnList.data;
    }
    return [];
  }, [groupTxnList, isError, isLoading]);

  const handleSettingsPress = () => {
    console.log("Settings pressed");
  };

  return (
    <View>
      <Card style={defaultStyles.topCard}>
        <View style={styles.topActionsContainer}>
          <BackButton />
          <Text style={defaultStyles.titleText}>{group?.name}</Text>
          <SettingsButton onPress={handleSettingsPress} />
        </View>
      </Card>
      <TransactionsList isLoading={isLoading} transactions={transactions} />
    </View>
  );
};

export default GroupDetails;

const styles = StyleSheet.create({
  topActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
