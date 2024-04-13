import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IProps {
  onPress: () => void;
}

const SettingsButton = ({ onPress }: IProps) => {
  return <MaterialCommunityIcons size={24} name="cog-outline" onPress={onPress} />;
};

export default SettingsButton;
