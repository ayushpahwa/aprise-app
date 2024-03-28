import { Spinner } from '@ui-kitten/components/ui';
import { StyleSheet, View } from 'react-native';

interface Props {
  style?: Record<string, any>;
}

export const LoadingIndicator = ({ style = {} }: Props): React.ReactElement => (
  <View style={[style, styles.indicator]}>
    <Spinner />
  </View>
);

const styles = StyleSheet.create({
  indicator: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
