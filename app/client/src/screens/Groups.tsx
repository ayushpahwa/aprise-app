import { View, Text } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import GroupsAPI from 'api/GroupsAPI';
import { ProgressBar } from '@ui-kitten/components';
import { QUERY_KEYS } from 'api/ApiConstants';

const Groups = () => {
  const { isLoading, data } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_GROUPS],
    queryFn: GroupsAPI.getGroups,
    enabled: true,
  });

  if (isLoading) {
    return <ProgressBar />;
  }

  return (
    <View>
      <Text>Groups</Text>
      {data?.data.map((group: any) => (
        <Text key={group.id}>{group.name}</Text>
      ))}
    </View>
  );
};

export default Groups;
