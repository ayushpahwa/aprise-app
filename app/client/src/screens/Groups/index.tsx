import { View, Text, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import GroupsAPI, { Group, GroupType } from 'api/GroupsAPI';
import { QUERY_KEYS } from 'api/ApiConstants';
import SearchInput from 'components/ui/SearchInput';
import { CREATE_GROUP_TITLE, PLACEHOLDER_SEARCH_GROUPS, YOUR_GROUPS_TITLE, createMessage } from 'constants/messages';
import CreateGroupCard from 'components/groups/GroupTypeSelector';
import { defaultStyles } from 'constants/styles';
import GroupsList from 'components/groups/GroupsList';
import { RootStackNavigationType, ScreenNamesEnum } from 'constants/navigationTypes';
import { useNavigation } from '@react-navigation/native';

const Groups = () => {
  const navigation = useNavigation<RootStackNavigationType>();
  const [searchText, setSearchText] = React.useState('');
  const { isLoading, data } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_GROUPS],
    queryFn: GroupsAPI.getGroups,
    enabled: true,
  });

  const groupsList = useMemo(() => {
    if (isLoading) return [];
    if (!!data) {
      return data?.data;
    }
    return [];
  }, [isLoading, data]);

  const onSelectChange = (groupType: GroupType) => {
    const params: Partial<Group> = { type: groupType };
    navigation.navigate(ScreenNamesEnum.ROOT_MANAGE_GROUPS, params);
  };

  return (
    <View style={styles.container}>
      <SearchInput value={searchText} onChangeText={setSearchText} placeholder={createMessage(PLACEHOLDER_SEARCH_GROUPS)} />
      <CreateGroupCard title={createMessage(CREATE_GROUP_TITLE)} onSelectChange={onSelectChange} />
      <Text style={defaultStyles.titleText}>{createMessage(YOUR_GROUPS_TITLE)}</Text>
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
