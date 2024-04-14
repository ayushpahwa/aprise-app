import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface IProps {
  onPress: () => void;
}

const SettingsButton = ({ onPress }: IProps) => {
  return (
    <MaterialCommunityIcons name="cog-outline" onPress={onPress} size={24} />
  );
};

export default SettingsButton;
