import React from "react";
import { useMutation } from "@tanstack/react-query";
import CustomTextInput from "components/ui/CustomTextInput";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import {
  emailValidationConfig,
  nameValidationConfig,
  passwordValidationConfig,
} from "constants/formValidationConfigs";
import {
  AUTH_ALERT_LOGIN_ERROR_TITLE,
  AUTH_ALERT_REGISTER_ERROR_MESSAGE,
  AUTH_FORM_DEFAULT_CURRENCY_LABEL,
  AUTH_FORM_EMAIL_LABEL,
  AUTH_FORM_FULLNAME_LABEL,
  AUTH_FORM_PASSWORD_LABEL,
  AUTH_FORM_SIGNUP_CTA_LABEL,
  createMessage,
} from "constants/messages";
import type { RegisterDTO } from "api/AuthAPI";
import AuthApi from "api/AuthAPI";
import { Button } from "@ui-kitten/components";
import { LoadingIndicator } from "components/ui/LoadingIndicator";
import { CurrencyPicker } from "components/ui/CurrencyPicker";
import { CURRENCIES } from "constants/txnConstants";

export interface RegisterFormInput {
  fullName: string;
  email: string;
  password: string;
  defaultCurrencyIndex: number;
}

const enum RegisterFormFields {
  fullName = "fullName",
  email = "email",
  password = "password",
  defaultCurrencyIndex = "defaultCurrencyIndex",
}

interface Props {
  onAuthenticate: (token: string) => void;
}

export const RegisterForm = ({ onAuthenticate }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormInput>();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (payload: RegisterDTO) => {
      return await AuthApi.register(payload);
    },
    onSuccess: (data) => {
      console.log("RegisterForm -> data", data);
      onAuthenticate(data.data.token);
    },
  });
  const submitHandler: SubmitHandler<RegisterFormInput> = async ({
    defaultCurrencyIndex,
    email,
    fullName,
    password,
  }) => {
    try {
      if (errors && Object.keys(errors).length > 0) return;
      const defaultCurrencyId = CURRENCIES[defaultCurrencyIndex].id;
      await mutateAsync({ email, password, fullName, defaultCurrencyId });
      console.log({ email, password, fullName, defaultCurrencyId });
    } catch (error: any) {
      Alert.alert(
        createMessage(AUTH_ALERT_LOGIN_ERROR_TITLE),
        createMessage(AUTH_ALERT_REGISTER_ERROR_MESSAGE),
      );
    }
  };
  return (
    <View style={styles.form}>
      <CustomTextInput
        autoCapitalize="words"
        autoComplete="name"
        control={control}
        label={createMessage(AUTH_FORM_FULLNAME_LABEL)}
        name={RegisterFormFields.fullName}
        validationRules={nameValidationConfig}
      />
      <CustomTextInput
        autoComplete="email"
        control={control}
        keyboardType="email-address"
        label={createMessage(AUTH_FORM_EMAIL_LABEL)}
        name={RegisterFormFields.email}
        validationRules={emailValidationConfig}
      />
      <CustomTextInput
        control={control}
        label={createMessage(AUTH_FORM_PASSWORD_LABEL)}
        name={RegisterFormFields.password}
        secure
        validationRules={passwordValidationConfig}
      />
      <CurrencyPicker
        control={control}
        label={createMessage(AUTH_FORM_DEFAULT_CURRENCY_LABEL)}
        name={RegisterFormFields.defaultCurrencyIndex}
      />
      {isPending && <LoadingIndicator style={styles.loadingIndicator} />}
      {!isPending && (
        <Button
          disabled={isPending}
          onPress={handleSubmit(submitHandler)}
          status="primary"
          style={styles.buttons}
        >
          {createMessage(AUTH_FORM_SIGNUP_CTA_LABEL)}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
  form: {
    marginVertical: 8,
  },
  loadingIndicator: {
    marginTop: 12,
  },
});
