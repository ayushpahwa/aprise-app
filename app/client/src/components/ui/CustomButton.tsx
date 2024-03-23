import { Button } from '@rneui/base';
import { View } from 'react-native';

interface Props {
  disabled?: boolean;
  loading?: boolean;
  title: string;
  onPress: () => void;
  style?: Record<string, any>;
}

export const CustomButton = ({ disabled = false, loading = false, title, onPress, style = {} }: Props) => {
  return (
    <View style={style}>
      <Button disabled={disabled} onPress={onPress} loading={loading}>
        {title}
      </Button>
    </View>
  );
};
