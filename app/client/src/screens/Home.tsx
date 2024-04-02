import { useQuery } from '@tanstack/react-query';
import { ProgressBar } from '@ui-kitten/components';
import { QUERY_KEYS } from 'api/ApiConstants';
import UserAPI from 'api/UserAPI';
import { DEFAULT_CURRENCY } from 'constants/txnConstants';
import { useMemo } from 'react';
import { View, Text } from 'react-native';

const Home = () => {
  const { isLoading: isProfileLoading, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: UserAPI.getUserProfile,
    enabled: true,
    refetchInterval: false,
  });

  const { accountBalance, currency, fullName } = useMemo(() => {
    if (!!data) {
      const fullName = data?.data?.fullName || 'User';
      const accountBalance = data?.data?.accounts.reduce((acc: number, account: any) => acc + account.current_balance, 0);
      const currency = data?.data?.defaultCurrency?.symbol || DEFAULT_CURRENCY.symbol;
      return { accountBalance, currency, fullName };
    }
    return { accountBalance: 0, currency: 'INR', fullName: 'User' };
  }, [data]);

  if (isProfileLoading) {
    return <ProgressBar />;
  }

  return (
    <View>
      <Text>Welcome {fullName}</Text>
      <Text>
        Your total account balance is: {currency} {accountBalance}
      </Text>
    </View>
  );
};

export default Home;
