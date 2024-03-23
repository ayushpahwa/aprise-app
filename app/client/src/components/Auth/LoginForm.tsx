import Button from 'components/ui/Button';
import { CustomButton } from 'components/ui/CustomButton';
import CustomTextInput from 'components/ui/CustomTextInput';
import { useForm, SubmitHandler } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { emailValidationConfig, passwordValidationConfig } from 'utils/formValidationConfigs';
import { AUTH_FORM_EMAIL_LABEL, AUTH_FORM_LOGIN_CTA_LABEL, AUTH_FORM_PASSWORD_LABEL, createMessage } from 'utils/messages';

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

export const LoginForm = ({}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInput>();
  const submitHandler: SubmitHandler<SignInFormInput> = ({ email, password }) => {
    if (!errors) console.log('Login form submitted', email, password);
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
        loading={false}
        disabled={false}
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
