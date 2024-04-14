import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { QUERY_KEYS } from 'api/ApiConstants';
import GroupsAPI from 'api/GroupsAPI';
import { useQuery } from '@tanstack/react-query';

interface Props {
  control: Control<any>;
  name: string;
}

const GroupSelector = ({ control, name }: Props) => {
  const {
    data: groups,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.FETCH_GROUPS],
    queryFn: GroupsAPI.getGroups,
  });

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={groups?.data?.length ? 0 : null}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <Text style={[styles.label, !!error && styles.labelInvalid]}>Group Selector</Text>
          <Select
            disabled={isLoading || isError}
            value={`${groups?.data[value]?.name || ''}`}
            onSelect={(index) => onChange((index as IndexPath).row)}
            placeholder="Select a group"
            style={{ width: '100%' }}
          >
            {groups?.data.map((group) => (
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
