import { View, Text, TextInput, StyleSheet } from 'react-native';

import { Colors } from '../../utils/styles';
import { Control, Controller, FieldPath, RegisterOptions } from 'react-hook-form';
import { SignInFormInput } from 'components/Auth/LoginForm';
import { VALIDATION_INVALID_INPUT, createMessage } from 'utils/messages';

type FieldName = FieldPath<SignInFormInput>;

interface Props {
  control: Control<SignInFormInput>;
  label: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secure?: boolean;
  name: FieldName; // Prop used by react-hook-form to identify the input
  validationRules?: Omit<RegisterOptions<SignInFormInput, FieldName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>; // Prop used by react-hook-form to define validation rules
}

function Input({ control, label, keyboardType, secure, name, validationRules = {} }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      rules={validationRules}
      render={({ field: { value, onBlur, onChange }, fieldState: { error } }) => {
        return (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, !!error && styles.labelInvalid]}>{label}</Text>
            <TextInput
              style={[styles.input, !!error && styles.inputInvalid]}
              autoCapitalize="none"
              keyboardType={keyboardType}
              secureTextEntry={secure}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
            {!!error && <Text style={{ color: Colors.error500 }}>{error.message || createMessage(VALIDATION_INVALID_INPUT)}</Text>}
          </View>
        );
      }}
    />
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: Colors.text,
    marginBottom: 4,
  },
  labelInvalid: {
    borderColor: Colors.error500,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderColor: Colors.accent_gray,
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 16,
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});
