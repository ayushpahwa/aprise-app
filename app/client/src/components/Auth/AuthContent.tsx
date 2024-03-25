import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/styles';
import { CardHandle } from 'components/ui/CardHandle';
import { AUTH_CONTENT_SWITCH_MODE, AUTH_CONTENT_TITLE, createMessage } from 'constants/messages';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Button } from '@ui-kitten/components';
import { useContext, useState } from 'react';
import { AuthContext } from 'store/AuthContext';

function AuthContent() {
  const { setToken } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);

  async function onAuthenticate(token: string) {
    setToken(token);
  }

  function switchAuthModeHandler() {
    if (isLogin) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }

  return (
    <View style={styles.authContent}>
      <CardHandle />
      <Text style={styles.titleText}>{createMessage(() => AUTH_CONTENT_TITLE(isLogin))}</Text>
      {isLogin && <LoginForm onAuthenticate={onAuthenticate} />}
      {!isLogin && <RegisterForm onAuthenticate={onAuthenticate} />}
      <Button appearance="ghost" onPress={switchAuthModeHandler}>
        {createMessage(() => AUTH_CONTENT_SWITCH_MODE(isLogin))}
      </Button>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 'auto',
    height: 'auto',
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
