import AuthContent from 'components/Auth/AuthContent';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

function AuthScreen() {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="height" enabled>
      <AuthContent />
    </KeyboardAvoidingView>
  );
}

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
