import { StyleSheet, View } from "react-native";
import React from "react";
import type { Group } from "api/GroupsAPI";
import GroupListItem from "./GroupListItem";
import { ProgressBar } from "@ui-kitten/components";
import { FlashList } from "@shopify/flash-list";

interface Props {
  groupsList: Array<Group>;
  isLoading: boolean;
}

const GroupsList = ({ groupsList, isLoading }: Props) => {
  return (
    <View style={styles.container}>
      {isLoading && <ProgressBar />}
      <FlashList
        data={groupsList}
        estimatedItemSize={10}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <GroupListItem group={item} />}
      />
    </View>
  );
};

export default GroupsList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
