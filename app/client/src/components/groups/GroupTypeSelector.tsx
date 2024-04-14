import React from "react";
import { StyleSheet, Text, View } from "react-native";
import GroupTypeCard from "./GroupTypeCard";
import { GroupType } from "api/GroupsAPI";
import { defaultStyles } from "constants/styles";

interface Props {
  title: string;
  onSelectChange: (groupType: GroupType) => void;
  selectedGroupType?: GroupType;
}

const GroupTypeSelector = ({
  onSelectChange,
  selectedGroupType,
  title,
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={defaultStyles.titleText}>{title}</Text>
      <View style={styles.ctaContainer}>
        {Object.values(GroupType).map((groupType) => (
          <GroupTypeCard
            groupType={groupType}
            key={groupType}
            onSelectChange={onSelectChange}
            selected={!!selectedGroupType && groupType === selectedGroupType}
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
