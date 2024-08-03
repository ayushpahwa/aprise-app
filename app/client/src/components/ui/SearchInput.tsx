import { StyleSheet } from "react-native";
import React from "react";
import { Input } from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SearchIcon = () => <MaterialCommunityIcons name="magnify" size={20} />;

interface Props {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const SearchInput = ({ onChangeText, placeholder, value }: Props) => {
  return (
    <Input
      accessoryLeft={SearchIcon}
      onChangeText={onChangeText}
      placeholder={placeholder || ""}
      size="large"
      style={styles.searchInput}
      value={value}
    />
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});
