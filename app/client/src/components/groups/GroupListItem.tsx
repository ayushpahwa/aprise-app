import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Group } from 'api/GroupsAPI';
import { generateSentenceCase, getGroupDescription, iconForGroupType } from 'utils/GroupUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from 'constants/styles';

interface Props {
  group: Group;
}

const GroupListItem = ({ group }: Props) => {
  const iconName = iconForGroupType(group.type);
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('Open group', group.id);
      }}
    >
      <View style={styles.container}>
        <View style={styles.groupIconContainer}>
          <MaterialCommunityIcons size={24} name={iconName} style={{ opacity: 0.6 }} />
        </View>
        <View style={styles.groupInfoContainer}>
          <Text style={styles.groupName}>{generateSentenceCase(group.name)}</Text>
          <Text style={styles.groupDescription}>{getGroupDescription(group.description, group.type)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroupListItem;

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
  },
  groupIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent_cta,
  },
  groupInfoContainer: {
    marginStart: 16,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupDescription: {
    fontSize: 14,
  },
});
