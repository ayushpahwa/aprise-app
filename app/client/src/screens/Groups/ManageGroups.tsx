import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { Group, GroupType } from 'api/GroupsAPI';
import { RootStackNavigationType, RootStackParamList, ScreenNamesEnum } from 'constants/navigationTypes';
import { RouteProp, useNavigation } from '@react-navigation/native';
import GroupTypeSelector from 'components/groups/GroupTypeSelector';
import { MANAGE_GROUP_FIELD_DESCRIPTION, MANAGE_GROUP_FIELD_NAME, MANAGE_GROUP_SCREEN_TITLE, SELECT_GROUP_TITLE, createMessage } from 'constants/messages';
import { Controller, useForm } from 'react-hook-form';
import CustomTextInput from 'components/ui/CustomTextInput';
import { fullNameValidationConfig } from 'constants/formValidationConfigs';
import { getDefaultGroupNames, getGroupDescription } from 'utils/GroupUtils';

export interface ManageGroupsFormInput {
  name: string;
  description: string;
  groupType: GroupType;
}

const enum ManageGroupsFormFields {
  name = 'name',
  description = 'description',
  groupType = 'groupType',
}

interface Iprops {
  route: RouteProp<RootStackParamList, ScreenNamesEnum.ROOT_MANAGE_GROUPS>;
}

const ManageGroups: React.FC<Iprops> = ({ route }) => {
  const { control, handleSubmit, watch, reset } = useForm<ManageGroupsFormInput>();

  const watchGroupType = watch(ManageGroupsFormFields.groupType);

  useEffect(() => {
    if (!watchGroupType) return;
    reset(
      {
        name: getDefaultGroupNames(watchGroupType),
        description: getGroupDescription('', watchGroupType),
        groupType: watchGroupType,
      },
      { keepValues: false },
    );
  }, [watchGroupType]);

  const navigation = useNavigation<RootStackNavigationType>();
  const { id, type }: Partial<Group> = route.params;
  const editMode = useMemo(() => !!id, [id]);

  // change header of the screen based on mode
  React.useLayoutEffect(() => {
    navigation.setOptions({ title: createMessage(() => MANAGE_GROUP_SCREEN_TITLE(editMode)) });
  }, [editMode]);
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={ManageGroupsFormFields.groupType}
        rules={{}}
        defaultValue={type}
        render={({ field: { value, onChange } }) => (
          <GroupTypeSelector title={createMessage(SELECT_GROUP_TITLE)} selectedGroupType={value} onSelectChange={onChange} />
        )}
      />
      <CustomTextInput
        autoCapitalize="words"
        autoComplete="name"
        defaultValue={getDefaultGroupNames(type || GroupType.PERSONAL)}
        name={ManageGroupsFormFields.name}
        label={createMessage(MANAGE_GROUP_FIELD_NAME)}
        control={control}
        validationRules={fullNameValidationConfig}
      />
      <CustomTextInput
        autoCapitalize="words"
        defaultValue={getGroupDescription('', type || GroupType.PERSONAL)}
        name={ManageGroupsFormFields.description}
        label={createMessage(MANAGE_GROUP_FIELD_DESCRIPTION)}
        control={control}
        validationRules={fullNameValidationConfig}
      />
    </View>
  );
};

export default ManageGroups;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
