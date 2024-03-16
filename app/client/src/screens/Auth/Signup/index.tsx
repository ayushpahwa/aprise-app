import { authenticate } from 'utils/auth';
import AuthContent from '../../../components/Auth/AuthContent';
import { useState } from 'react';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import { Alert } from 'react-native';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function signUpHandler({ email, password }: { email: string; password: string }) {
    setIsAuthenticating(true);
    try {
      await authenticate(email, password, false);
    } catch (error) {
      console.error(error);
      Alert.alert('Authentication failed', 'Please check your credentials and try again.');
    }
    setIsAuthenticating(false);
  }

  if (isAuthenticating) return <LoadingOverlay message="Creating user..." />;

  return <AuthContent onAuthenticate={signUpHandler} />;
}

export default SignupScreen;
