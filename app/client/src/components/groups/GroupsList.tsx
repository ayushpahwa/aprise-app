import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Group } from 'api/GroupsAPI';
import GroupListItem from './GroupListItem';
import { ProgressBar } from '@ui-kitten/components';

interface Props {
  groupsList: Array<Group>;
  isLoading: boolean;
}

const GroupsList = ({ groupsList, isLoading }: Props) => {
  return (
    <View style={styles.container}>
      {isLoading && <ProgressBar />}
      <FlatList data={groupsList} renderItem={({ item }) => <GroupListItem group={item} />} keyExtractor={(item) => item.id.toString()} />
    </View>
  );
};

export default GroupsList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
