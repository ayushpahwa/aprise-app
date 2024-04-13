import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface IProps {
  onPress?: () => void;
}

const BackButton = ({ onPress }: IProps) => {
  const navigation = useNavigation();
  const handleBack = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };
  return <MaterialCommunityIcons size={24} name="arrow-left" onPress={handleBack} />;
};

export default BackButton;
