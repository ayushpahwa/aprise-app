import { View, StyleSheet } from 'react-native';
import { Colors } from 'constants/styles';

export const CardHandle = () => {
  return <View style={styles.cardHandle} />;
};

const styles = StyleSheet.create({
  cardHandle: {
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: -20,
    width: 40,
    height: 4,
    backgroundColor: Colors.accent_gray,
    borderRadius: 0,
  },
});
