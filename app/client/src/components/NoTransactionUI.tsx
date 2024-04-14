import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationType, ScreenNamesEnum } from 'constants/types/navigationTypes';
import { View, Text, Button } from 'react-native';

export const NoTransactionUI = () => {
  const { navigate } = useNavigation<RootStackNavigationType>();
  return (
    <View>
      <Text>No transactions yet, click here to record your first transaction</Text>
      <Button
        title="Add Transaction"
        onPress={() => {
          navigate(ScreenNamesEnum.ROOT_TRANSACTION_MODAL);
        }}
      />
    </View>
  );
};
