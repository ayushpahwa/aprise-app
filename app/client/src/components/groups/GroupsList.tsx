import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
    <ScrollView style={styles.container}>
      {isLoading && <ProgressBar />}
      {groupsList?.map((group: any) => (
        <GroupListItem key={group.id} group={group} />
      ))}
    </ScrollView>
  );
};

export default GroupsList;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});
