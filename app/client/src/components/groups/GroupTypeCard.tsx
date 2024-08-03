import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { GroupType } from "api/GroupsAPI";
import { generateSentenceCase, iconForGroupType } from "utils/GroupUtils";
import { Colors } from "constants/styles";

interface Props {
  groupType: GroupType;
  selected: boolean;
  onSelectChange: (groupType: GroupType) => void;
}

const GroupTypeCard = ({ groupType, onSelectChange, selected }: Props) => {
  const iconName = iconForGroupType(groupType);

  return (
    <TouchableOpacity
      onPress={() => {
        onSelectChange(groupType);
      }}
    >
      <View style={[styles.container, selected && styles.selected]}>
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          style={styles.groupIcon}
        />
        <Text>{generateSentenceCase(groupType)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GroupTypeCard;

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    borderBlockColor: "black",
    borderWidth: 0.8,
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  selected: {
    backgroundColor: Colors.accent_gray,
    borderWidth: 2,
  },
  groupIcon: {
    opacity: 0.5,
  },
});
