import { View, Text, StyleSheet } from 'react-native';
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import GroupsAPI from 'api/GroupsAPI';
import { QUERY_KEYS } from 'api/ApiConstants';
import SearchInput from 'components/ui/SearchInput';
import { PLACEHOLDER_SEARCH_GROUPS, YOUR_GROUPS_TITLE, createMessage } from 'constants/messages';
import CreateGroup from 'components/groups/CreateGroup';
import { defaultStyles } from 'constants/styles';
import GroupsList from 'components/groups/GroupsList';

const Groups = () => {
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

  return (
    <View style={styles.container}>
      <SearchInput value={searchText} onChangeText={setSearchText} placeholder={createMessage(PLACEHOLDER_SEARCH_GROUPS)} />
      <CreateGroup />
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
