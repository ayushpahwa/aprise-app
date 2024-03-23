import AuthContent from '../../../components/Auth/AuthContent';
import { useState } from 'react';
import LoadingOverlay from 'components/ui/LoadingOverlay';

function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  async function onLoginHandler(token: string) {
    setIsLoading(true);
    // Simulate a network request
    setTimeout(() => {
      setIsLoading(false);
      console.log(`Logged in with token: ${token}`);
    }, 1000);
  }

  if (isLoading) return <LoadingOverlay message="Fetching user details..." />;
  return <AuthContent isLogin onAuthenticate={onLoginHandler} />;
}

export default LoginScreen;
