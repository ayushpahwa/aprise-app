import { useMutation } from '@tanstack/react-query';
import { CustomButton } from 'components/ui/CustomButton';
import CustomTextInput from 'components/ui/CustomTextInput';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import { emailValidationConfig, passwordValidationConfig } from 'constants/formValidationConfigs';
import {
  AUTH_ALERT_LOGIN_ERROR_MESSAGE,
  AUTH_ALERT_LOGIN_ERROR_TITLE,
  AUTH_FORM_EMAIL_LABEL,
  AUTH_FORM_LOGIN_CTA_LABEL,
  AUTH_FORM_PASSWORD_LABEL,
  createMessage,
} from 'constants/messages';
import AuthApi, { LoginDTO } from 'api/AuthAPI';

export interface SignInFormInput {
  email: string;
  password: string;
}

const enum LoginFormFields {
  email = 'email',
  password = 'password',
}

interface Props {
  onAuthenticate: (token: string) => void;
}

export const LoginForm = ({ onAuthenticate }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInput>();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: LoginDTO) => {
      return await AuthApi.login(payload);
    },
    onSuccess: (data) => {
      onAuthenticate(data.data.token);
    },
  });
  const submitHandler: SubmitHandler<SignInFormInput> = async ({ email, password }) => {
    try {
      if (errors && Object.keys(errors).length > 0) return;
      await mutateAsync({ email, password });
    } catch (error: any) {
      Alert.alert(createMessage(AUTH_ALERT_LOGIN_ERROR_TITLE), createMessage(AUTH_ALERT_LOGIN_ERROR_MESSAGE));
    }
  };
  return (
    <View style={styles.form}>
      <CustomTextInput
        name={LoginFormFields.email}
        label={createMessage(AUTH_FORM_EMAIL_LABEL)}
        keyboardType="email-address"
        control={control}
        validationRules={emailValidationConfig}
      />
      <CustomTextInput
        name={LoginFormFields.password}
        label={createMessage(AUTH_FORM_PASSWORD_LABEL)}
        secure
        control={control}
        validationRules={passwordValidationConfig}
      />
      <CustomButton
        onPress={handleSubmit(submitHandler)}
        title={createMessage(AUTH_FORM_LOGIN_CTA_LABEL)}
        style={styles.buttons}
        loading={isPending}
        disabled={isPending}
      />
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
});
