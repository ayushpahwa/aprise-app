import { useMutation } from '@tanstack/react-query';
import CustomTextInput from 'components/ui/CustomTextInput';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Alert, StyleSheet, View } from 'react-native';
import { emailValidationConfig, fullNameValidationConfig, passwordValidationConfig } from 'constants/formValidationConfigs';
import {
  AUTH_ALERT_LOGIN_ERROR_TITLE,
  AUTH_ALERT_REGISTER_ERROR_MESSAGE,
  AUTH_FORM_DEFAULT_CURRENCY_LABEL,
  AUTH_FORM_EMAIL_LABEL,
  AUTH_FORM_FULLNAME_LABEL,
  AUTH_FORM_PASSWORD_LABEL,
  AUTH_FORM_SIGNUP_CTA_LABEL,
  createMessage,
} from 'constants/messages';
import AuthApi, { RegisterDTO } from 'api/AuthAPI';
import { Button } from '@ui-kitten/components';
import { LoadingIndicator } from 'components/ui/LoadingIndicator';
import { CurrencyPicker } from 'components/ui/CurrencyPicker';
import { CURRENCIES } from 'constants/txnConstants';

export interface RegisterFormInput {
  fullName: string;
  email: string;
  password: string;
  defaultCurrencyIndex: number;
}

const enum RegisterFormFields {
  fullName = 'fullName',
  email = 'email',
  password = 'password',
  defaultCurrencyIndex = 'defaultCurrencyIndex',
}

interface Props {
  onAuthenticate: (token: string) => void;
}

export const RegisterForm = ({ onAuthenticate }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: RegisterDTO) => {
      return await AuthApi.register(payload);
    },
    onSuccess: (data) => {
      console.log('RegisterForm -> data', data);
      onAuthenticate(data.data.token);
    },
  });
  const submitHandler: SubmitHandler<RegisterFormInput> = async ({ email, password, fullName, defaultCurrencyIndex }) => {
    try {
      if (errors && Object.keys(errors).length > 0) return;
      const defaultCurrencyId = CURRENCIES[defaultCurrencyIndex].id;
      await mutateAsync({ email, password, fullName, defaultCurrencyId });
      console.log({ email, password, fullName, defaultCurrencyId });
    } catch (error: any) {
      Alert.alert(createMessage(AUTH_ALERT_LOGIN_ERROR_TITLE), createMessage(AUTH_ALERT_REGISTER_ERROR_MESSAGE));
    }
  };
  return (
    <View style={styles.form}>
      <CustomTextInput
        name={RegisterFormFields.fullName}
        label={createMessage(AUTH_FORM_FULLNAME_LABEL)}
        control={control}
        validationRules={fullNameValidationConfig}
      />
      <CustomTextInput
        name={RegisterFormFields.email}
        label={createMessage(AUTH_FORM_EMAIL_LABEL)}
        keyboardType="email-address"
        control={control}
        validationRules={emailValidationConfig}
      />
      <CustomTextInput
        name={RegisterFormFields.password}
        label={createMessage(AUTH_FORM_PASSWORD_LABEL)}
        secure
        control={control}
        validationRules={passwordValidationConfig}
      />
      <CurrencyPicker name={RegisterFormFields.defaultCurrencyIndex} control={control} label={createMessage(AUTH_FORM_DEFAULT_CURRENCY_LABEL)} />
      {isPending && <LoadingIndicator style={styles.loadingIndicator} />}
      {!isPending && (
        <Button onPress={handleSubmit(submitHandler)} style={styles.buttons} disabled={isPending} status="primary">
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
