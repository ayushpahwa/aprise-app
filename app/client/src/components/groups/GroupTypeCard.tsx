import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GroupType } from 'api/GroupsAPI';
import { iconForGroupType } from 'utils/GroupUtils';

interface Props {
  groupType: GroupType;
}

const GroupTypeCard = ({ groupType }: Props) => {
  const iconName = iconForGroupType(groupType);
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('Create new group', groupType);
      }}
    >
      <View style={styles.container}>
        <MaterialCommunityIcons size={24} name={iconName} style={styles.groupIcon} />
        <Text>{groupType}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GroupTypeCard;

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    borderBlockColor: 'black',
    borderWidth: 0.8,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  groupIcon: {
    opacity: 0.5,
  },
});
