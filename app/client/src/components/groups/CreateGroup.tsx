import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import GroupTypeCard from './GroupTypeCard';
import { GroupType } from 'api/GroupsAPI';
import { defaultStyles } from 'constants/styles';
import { CREATE_GROUP_TITLE, createMessage } from 'constants/messages';

const CreateGroup = () => {
  return (
    <View style={styles.container}>
      <Text style={defaultStyles.titleText}>{createMessage(CREATE_GROUP_TITLE)}</Text>
      <View style={styles.ctaContainer}>
        {Object.values(GroupType).map((groupType) => (
          <GroupTypeCard key={groupType} groupType={groupType} />
        ))}
      </View>
    </View>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
