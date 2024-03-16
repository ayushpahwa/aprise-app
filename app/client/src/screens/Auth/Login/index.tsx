import { authenticate } from 'utils/auth';
import AuthContent from '../../../components/Auth/AuthContent';
import { useState } from 'react';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import { Alert } from 'react-native';

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function loginHandler(credentials: { email: string; password: string }) {
    setIsAuthenticating(true);
    try {
      const output = await authenticate(credentials.email, credentials.password, true);
      console.log(output);
    } catch (error) {
      console.error(error);
      Alert.alert('Authentication failed', 'Please check your credentials and try again.');
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) return <LoadingOverlay message="Logging in..." />;
  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
