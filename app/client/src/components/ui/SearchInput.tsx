import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Input } from '@ui-kitten/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SearchIcon = () => <MaterialCommunityIcons size={20} name="magnify" />;

interface Props {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const SearchInput = ({ placeholder, value, onChangeText }: Props) => {
  return <Input style={styles.searchInput} placeholder={placeholder || ''} accessoryLeft={SearchIcon} size="large" value={value} onChangeText={onChangeText} />;
};

export default SearchInput;

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
