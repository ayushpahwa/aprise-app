import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import { Colors } from '../../utils/styles';
import { useNavigation } from '@react-navigation/native';
import { CardHandle } from 'components/ui/CardHandle';
import { AUTH_CONTENT_SWITCH_MODE, AUTH_CONTENT_TITLE, createMessage } from 'utils/messages';

interface Props {
  isLogin?: boolean;
  onAuthenticate?: (credentials: { email: string; password: string }) => void;
}

function AuthContent({ isLogin, onAuthenticate }: Props) {
  const { replace } = useNavigation<any>();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      replace('Signup', { replace: true });
    } else {
      replace('Login', { replace: true });
    }
  }

  function submitHandler(credentials: { email: string; confirmEmail: string; password: string; confirmPassword: string }) {
    if (!onAuthenticate) return;

    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (!emailIsValid || !passwordIsValid || (!isLogin && (!emailsAreEqual || !passwordsAreEqual))) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  }

  return (
    <View style={styles.authContent}>
      <CardHandle />
      <Text style={styles.titleText}>{createMessage(AUTH_CONTENT_TITLE)}</Text>
      <AuthForm isLogin={!!isLogin} onSubmit={submitHandler} credentialsInvalid={credentialsInvalid} />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>{createMessage(AUTH_CONTENT_SWITCH_MODE)}</FlatButton>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 'auto',
    height: '50%',
    padding: 32,
    borderRadius: 8,
    backgroundColor: Colors.background,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
  titleText: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
