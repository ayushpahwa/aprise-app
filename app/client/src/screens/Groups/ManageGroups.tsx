import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import GroupsAPI, { CreateGroupDTO, Group, GroupType } from 'api/GroupsAPI';
import { RootStackNavigationType, RootStackParamList, ScreenNamesEnum } from 'constants/navigationTypes';
import { RouteProp, useNavigation } from '@react-navigation/native';
import GroupTypeSelector from 'components/groups/GroupTypeSelector';
import {
  AUTH_FORM_DEFAULT_CURRENCY_LABEL,
  MANAGE_GROUP_CTA,
  MANAGE_GROUP_FIELD_DESCRIPTION,
  MANAGE_GROUP_FIELD_NAME,
  MANAGE_GROUP_SCREEN_TITLE,
  SELECT_GROUP_TITLE,
  createMessage,
} from 'constants/messages';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import CustomTextInput from 'components/ui/CustomTextInput';
import { descValidationConfig, nameValidationConfig } from 'constants/formValidationConfigs';
import { getDefaultGroupNames, getGroupDescription } from 'utils/GroupUtils';
import { Button } from '@ui-kitten/components';
import { CurrencyPicker } from 'components/ui/CurrencyPicker';
import { useMutation } from '@tanstack/react-query';
import { LoadingIndicator } from 'components/ui/LoadingIndicator';
import { ApiResponse } from 'constants/apiConstants';
import { validateResponse } from 'utils/ApiUtils';
import { CURRENCIES } from 'constants/txnConstants';

export interface ManageGroupsFormInput {
  name: string;
  description: string;
  groupType: GroupType;
  defaultCurrencyIndex: number;
}

const enum ManageGroupsFormFields {
  name = 'name',
  description = 'description',
  groupType = 'groupType',
  defaultCurrencyIndex = 'defaultCurrencyIndex',
}

interface Iprops {
  route: RouteProp<RootStackParamList, ScreenNamesEnum.ROOT_MANAGE_GROUPS>;
}

const ManageGroups: React.FC<Iprops> = ({ route }) => {
  const navigation = useNavigation<RootStackNavigationType>();
  const { id, type }: Partial<Group> = route.params;
  const editMode = useMemo(() => !!id, [id]);

  // change header of the screen based on mode
  React.useLayoutEffect(() => {
    navigation.setOptions({ title: createMessage(() => MANAGE_GROUP_SCREEN_TITLE(editMode)) });
  }, [editMode]);

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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: CreateGroupDTO) => {
      const response: ApiResponse<Group> = await GroupsAPI.createGroup(payload);
      return response;
    },
    onSuccess: (data) => {
      if (validateResponse(data)) navigation.goBack();
    },
  });

  const submitHandler: SubmitHandler<ManageGroupsFormInput> = async ({ name, groupType, description, defaultCurrencyIndex }) => {
    try {
      const currencyId = CURRENCIES[defaultCurrencyIndex].id;
      await mutateAsync({ name, type: groupType, description, currencyId, members: [] });
    } catch (error: any) {
      console.debug('CreateGroup -> error', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };
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
        validationRules={nameValidationConfig}
      />
      <CustomTextInput
        autoCapitalize="words"
        defaultValue={getGroupDescription('', type || GroupType.PERSONAL)}
        name={ManageGroupsFormFields.description}
        label={createMessage(MANAGE_GROUP_FIELD_DESCRIPTION)}
        control={control}
        validationRules={descValidationConfig}
      />
      <CurrencyPicker name={ManageGroupsFormFields.defaultCurrencyIndex} control={control} label={createMessage(AUTH_FORM_DEFAULT_CURRENCY_LABEL)} />
      {isPending && <LoadingIndicator style={styles.submitButton} />}
      {!isPending && (
        <Button style={styles.submitButton} onPress={handleSubmit(submitHandler)}>
          {createMessage(() => MANAGE_GROUP_CTA(editMode))}
        </Button>
      )}
    </View>
  );
};

export default ManageGroups;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  submitButton: {
    marginTop: 24,
  },
});
