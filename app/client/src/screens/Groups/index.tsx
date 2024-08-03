import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import type { Group, GroupType } from "api/GroupsAPI";
import GroupsAPI from "api/GroupsAPI";
import { QUERY_KEYS } from "api/ApiConstants";
import SearchInput from "components/ui/SearchInput";
import {
  CREATE_GROUP_TITLE,
  PLACEHOLDER_SEARCH_GROUPS,
  YOUR_GROUPS_TITLE,
  createMessage,
} from "constants/messages";
import CreateGroupCard from "components/groups/GroupTypeSelector";
import { defaultStyles } from "constants/styles";
import GroupsList from "components/groups/GroupsList";
import type { RootStackNavigationType } from "constants/types/navigationTypes";
import { ScreenNamesEnum } from "constants/types/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { validateResponse } from "utils/ApiUtils";

const Groups = () => {
  const navigation = useNavigation<RootStackNavigationType>();
  const [searchText, setSearchText] = React.useState("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_GROUPS],
    queryFn: GroupsAPI.getGroups,
    enabled: true,
    retryOnMount: true,
  });

  // refetch groups on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch();
    });
    return unsubscribe;
  }, [navigation, refetch]);

  const groupsList = useMemo(() => {
    if (isLoading) return [];
    if (validateResponse(data)) {
      return data?.data || [];
    }
    return [];
  }, [isLoading, data]);

  const onSelectChange = (groupType: GroupType) => {
    const params: Partial<Group> = { type: groupType };
    navigation.navigate(ScreenNamesEnum.ROOT_MANAGE_GROUPS, params);
  };

  return (
    <View style={styles.container}>
      <SearchInput
        onChangeText={setSearchText}
        placeholder={createMessage(PLACEHOLDER_SEARCH_GROUPS)}
        value={searchText}
      />
      <CreateGroupCard
        onSelectChange={onSelectChange}
        title={createMessage(CREATE_GROUP_TITLE)}
      />
      <Text style={defaultStyles.titleText}>
        {createMessage(YOUR_GROUPS_TITLE)}
      </Text>
      <GroupsList groupsList={groupsList} isLoading={isLoading} />
    </View>
  );
};

export default Groups;

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    padding: 24,
  },
});
