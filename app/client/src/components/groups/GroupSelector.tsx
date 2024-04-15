import { StyleSheet, Text, View } from "react-native";
import React from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { IndexPath } from "@ui-kitten/components";
import { Select, SelectItem } from "@ui-kitten/components";
import type { Group } from "api/GroupsAPI";
import {
  VALIDATION_GROUP_NAME_REQUIRED,
  createMessage,
} from "constants/messages";
import { Colors } from "constants/styles";

interface Props {
  control: Control<any>;
  name: string;
  groups: Group[];
  disabled?: boolean;
}

const GroupSelector = ({ control, disabled, groups, name }: Props) => {
  return (
    <Controller
      control={control}
      defaultValue={groups?.length ? 0 : null}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <Text style={styles.label}>Group Selector</Text>
          <Select
            disabled={disabled}
            onSelect={(index) => onChange((index as IndexPath).row)}
            placeholder="Select a group"
            style={[{ width: "100%" }, !!error && styles.labelInvalid]}
            value={`${groups[value]?.name || ""}`}
          >
            {groups.map((group) => (
              <SelectItem key={group.id} title={group.name} />
            ))}
          </Select>
          {!!error && (
            <Text style={styles.errorText}>
              {error.message || createMessage(VALIDATION_GROUP_NAME_REQUIRED)}
            </Text>
          )}
        </View>
      )}
      rules={{ required: true }}
    />
  );
};

export default GroupSelector;

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
  },
  labelInvalid: {
    borderColor: Colors.error500,
    borderWidth: 0.4,
  },
  errorText: {
    color: Colors.error500,
  },
});
