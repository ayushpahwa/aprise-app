import React from "react";
import { useMutation } from "@tanstack/react-query";
import CustomTextInput from "components/ui/CustomTextInput";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import {
  emailValidationConfig,
  passwordValidationConfig,
} from "constants/formValidationConfigs";
import {
  AUTH_ALERT_LOGIN_ERROR_MESSAGE,
  AUTH_ALERT_LOGIN_ERROR_TITLE,
  AUTH_FORM_EMAIL_LABEL,
  AUTH_FORM_LOGIN_CTA_LABEL,
  AUTH_FORM_PASSWORD_LABEL,
  createMessage,
} from "constants/messages";
import type { LoginDTO } from "api/AuthAPI";
import AuthApi from "api/AuthAPI";
import { Button } from "@ui-kitten/components";
import { LoadingIndicator } from "components/ui/LoadingIndicator";

export interface SignInFormInput {
  email: string;
  password: string;
}

const enum LoginFormFields {
  email = "email",
  password = "password",
}

interface Props {
  onAuthenticate: (token: string) => void;
}

export const LoginForm = ({ onAuthenticate }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormInput>();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (payload: LoginDTO) => {
      return await AuthApi.login(payload);
    },
    onSuccess: (data) => {
      onAuthenticate(data.data.token);
    },
  });
  const submitHandler: SubmitHandler<SignInFormInput> = async ({
    email,
    password,
  }) => {
    try {
      if (errors && Object.keys(errors).length > 0) return;
      await mutateAsync({ email, password });
    } catch (error: any) {
      Alert.alert(
        createMessage(AUTH_ALERT_LOGIN_ERROR_TITLE),
        createMessage(AUTH_ALERT_LOGIN_ERROR_MESSAGE),
      );
    }
  };
  return (
    <View style={styles.form}>
      <CustomTextInput
        autoComplete="email"
        control={control}
        keyboardType="email-address"
        label={createMessage(AUTH_FORM_EMAIL_LABEL)}
        name={LoginFormFields.email}
        validationRules={emailValidationConfig}
      />
      <CustomTextInput
        control={control}
        label={createMessage(AUTH_FORM_PASSWORD_LABEL)}
        name={LoginFormFields.password}
        secure
        validationRules={passwordValidationConfig}
      />
      {isPending && <LoadingIndicator style={styles.loadingIndicator} />}
      {!isPending && (
        <Button
          disabled={isPending}
          onPress={handleSubmit(submitHandler)}
          status="primary"
          style={styles.buttons}
        >
          {createMessage(AUTH_FORM_LOGIN_CTA_LABEL)}
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
