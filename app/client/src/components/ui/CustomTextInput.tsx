import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '../../constants/styles';
import { Control, Controller, FieldPath, RegisterOptions } from 'react-hook-form';
import { VALIDATION_INVALID_INPUT, createMessage } from 'constants/messages';
import { Input, ProgressBar } from '@ui-kitten/components';

type FieldName = FieldPath<any>;

interface Props {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'email' | 'name';
  label: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secure?: boolean;
  control: Control<any>;
  name: FieldName; // Prop used by react-hook-form to identify the input
  validationRules?: Omit<RegisterOptions<any, FieldName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>; // Prop used by react-hook-form to define validation rules
}

function CustomTextInput({ autoCapitalize = 'none', autoComplete, control, label, keyboardType, secure, name, validationRules = {} }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      rules={validationRules}
      render={({ field: { value, onBlur, onChange }, fieldState: { error } }) => (
        <View style={[styles.inputContainer]}>
          <Text style={[styles.label, !!error && styles.labelInvalid]}>{label}</Text>
          <Input
            style={[styles.input, !!error && styles.inputInvalid]}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            keyboardType={keyboardType}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            textStyle={!!secure ? { color: 'rgba(0,0,0,0)' } : {}} // Hide text in secure input
          />
          {!!secure && <ProgressBar progress={(!!value ? value?.length : 0) / 6} status={(!!value ? value?.length : 0) < 3 ? 'danger' : 'success'} />}
          {!!error && <Text style={styles.errorText}>{error.message || createMessage(VALIDATION_INVALID_INPUT)}</Text>}
        </View>
      )}
    />
  );
}

export default CustomTextInput;

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
    borderColor: Colors.accent_gray,
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 16,
  },
  errorText: {
    color: Colors.error500,
  },
  inputInvalid: {
    borderColor: Colors.error100,
  },
});
