import { StyleSheet, Text, View } from 'react-native';

import FlatButton from '../ui/FlatButton';
import { Colors } from '../../utils/styles';
import { useNavigation } from '@react-navigation/native';
import { CardHandle } from 'components/ui/CardHandle';
import { AUTH_CONTENT_SWITCH_MODE, AUTH_CONTENT_TITLE, createMessage } from 'utils/messages';
import { LoginForm } from './LoginForm';

interface Props {
  isLogin?: boolean;
  onAuthenticate?: (credentials: { email: string; password: string }) => void;
}

function AuthContent({ isLogin, onAuthenticate }: Props) {
  const { replace } = useNavigation<any>();

  function switchAuthModeHandler() {
    if (isLogin) {
      replace('Signup', { replace: true });
    } else {
      replace('Login', { replace: true });
    }
  }

  return (
    <View style={styles.authContent}>
      <CardHandle />
      <Text style={styles.titleText}>{createMessage(() => AUTH_CONTENT_TITLE(isLogin))}</Text>
      <LoginForm />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>{createMessage(() => AUTH_CONTENT_SWITCH_MODE(isLogin))}</FlatButton>
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
