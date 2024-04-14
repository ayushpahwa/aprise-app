import React, { useEffect, useMemo } from "react";
import { Alert, StyleSheet, View } from "react-native";
import type { CreateGroupDTO, Group } from "api/GroupsAPI";
import GroupsAPI, { GroupType } from "api/GroupsAPI";
import type {
  RootStackNavigationType,
  RootStackParamList,
  ScreenNamesEnum,
} from "constants/types/navigationTypes";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import GroupTypeSelector from "components/groups/GroupTypeSelector";
import {
  AUTH_FORM_DEFAULT_CURRENCY_LABEL,
  MANAGE_GROUP_CTA,
  MANAGE_GROUP_FIELD_DESCRIPTION,
  MANAGE_GROUP_FIELD_NAME,
  MANAGE_GROUP_SCREEN_TITLE,
  SELECT_GROUP_TITLE,
  createMessage,
} from "constants/messages";
import type { SubmitHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import CustomTextInput from "components/ui/CustomTextInput";
import {
  descValidationConfig,
  nameValidationConfig,
} from "constants/formValidationConfigs";
import { getDefaultGroupNames, getGroupDescription } from "utils/GroupUtils";
import { Button } from "@ui-kitten/components";
import { CurrencyPicker } from "components/ui/CurrencyPicker";
import { useMutation } from "@tanstack/react-query";
import { LoadingIndicator } from "components/ui/LoadingIndicator";
import type { ApiResponse } from "constants/types/apiTypes";
import { validateResponse } from "utils/ApiUtils";
import { CURRENCIES } from "constants/txnConstants";
import { debug } from "loglevel";

export interface ManageGroupsFormInput {
  name: string;
  description: string;
  groupType: GroupType;
  defaultCurrencyIndex: number;
}

const enum ManageGroupsFormFields {
  name = "name",
  description = "description",
  groupType = "groupType",
  defaultCurrencyIndex = "defaultCurrencyIndex",
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
    navigation.setOptions({
      title: createMessage(() => MANAGE_GROUP_SCREEN_TITLE(editMode)),
    });
  }, [editMode]);

  const { control, handleSubmit, reset, watch } =
    useForm<ManageGroupsFormInput>();

  const watchGroupType = watch(ManageGroupsFormFields.groupType);

  useEffect(() => {
    if (!watchGroupType) return;
    reset(
      {
        name: getDefaultGroupNames(watchGroupType),
        description: getGroupDescription("", watchGroupType),
        groupType: watchGroupType,
      },
      { keepValues: false },
    );
  }, [watchGroupType]);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (payload: CreateGroupDTO) => {
      const response: ApiResponse<Group> = await GroupsAPI.createGroup(payload);
      return response;
    },
    onSuccess: (data) => {
      if (validateResponse(data)) navigation.goBack();
    },
  });

  const submitHandler: SubmitHandler<ManageGroupsFormInput> = async ({
    defaultCurrencyIndex,
    description,
    groupType,
    name,
  }) => {
    try {
      const currencyId = CURRENCIES[defaultCurrencyIndex].id;
      await mutateAsync({
        name,
        type: groupType,
        description,
        currencyId,
        members: [],
      });
    } catch (error: any) {
      debug("CreateGroup -> error", error);
      Alert.alert("Error", "Something went wrong");
    }
  };
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        defaultValue={type}
        name={ManageGroupsFormFields.groupType}
        render={({ field: { onChange, value } }) => (
          <GroupTypeSelector
            onSelectChange={onChange}
            selectedGroupType={value}
            title={createMessage(SELECT_GROUP_TITLE)}
          />
        )}
        rules={{}}
      />
      <CustomTextInput
        autoCapitalize="words"
        autoComplete="name"
        control={control}
        defaultValue={getDefaultGroupNames(type || GroupType.PERSONAL)}
        label={createMessage(MANAGE_GROUP_FIELD_NAME)}
        name={ManageGroupsFormFields.name}
        validationRules={nameValidationConfig}
      />
      <CustomTextInput
        autoCapitalize="words"
        control={control}
        defaultValue={getGroupDescription("", type || GroupType.PERSONAL)}
        label={createMessage(MANAGE_GROUP_FIELD_DESCRIPTION)}
        name={ManageGroupsFormFields.description}
        validationRules={descValidationConfig}
      />
      <CurrencyPicker
        control={control}
        label={createMessage(AUTH_FORM_DEFAULT_CURRENCY_LABEL)}
        name={ManageGroupsFormFields.defaultCurrencyIndex}
      />
      {isPending && <LoadingIndicator style={styles.submitButton} />}
      {!isPending && (
        <Button
          onPress={handleSubmit(submitHandler)}
          style={styles.submitButton}
        >
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
