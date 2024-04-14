import React from "react";
import AuthContent from "components/Auth/AuthContent";
import { KeyboardAvoidingView, StyleSheet } from "react-native";

function AuthScreen() {
  return (
    <KeyboardAvoidingView behavior="height" enabled style={styles.container}>
      <AuthContent />
    </KeyboardAvoidingView>
  );
}

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
