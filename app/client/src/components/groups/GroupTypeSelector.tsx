import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import GroupTypeCard from './GroupTypeCard';
import { GroupType } from 'api/GroupsAPI';
import { defaultStyles } from 'constants/styles';

interface Props {
  title: string;
  onSelectChange: (groupType: GroupType) => void;
  selectedGroupType?: GroupType;
}

const GroupTypeSelector = ({ title, selectedGroupType, onSelectChange }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={defaultStyles.titleText}>{title}</Text>
      <View style={styles.ctaContainer}>
        {Object.values(GroupType).map((groupType) => (
          <GroupTypeCard
            key={groupType}
            groupType={groupType}
            selected={!!selectedGroupType && groupType === selectedGroupType}
            onSelectChange={onSelectChange}
          />
        ))}
      </View>
    </View>
  );
};

export default GroupTypeSelector;

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
