import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { Group } from 'api/GroupsAPI';

interface Props {
  control: Control<any>;
  name: string;
  groups: Group[];
  disabled?: boolean;
}

const GroupSelector = ({ control, name, groups, disabled }: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={groups?.length ? 0 : null}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <Text style={[styles.label, !!error && styles.labelInvalid]}>Group Selector</Text>
          <Select
            disabled={disabled}
            value={`${groups[value]?.name || ''}`}
            onSelect={(index) => onChange((index as IndexPath).row)}
            placeholder="Select a group"
            style={{ width: '100%' }}
          >
            {groups.map((group) => (
              <SelectItem key={group.id} title={group.name} />
            ))}
          </Select>
        </View>
      )}
    />
  );
};

export default GroupSelector;

const styles = StyleSheet.create({
  label: {
    color: Colors.text,
    marginBottom: 4,
  },
  labelInvalid: {
    borderColor: Colors.error500,
  },
});
