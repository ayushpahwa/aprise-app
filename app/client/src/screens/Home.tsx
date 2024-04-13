import { useQuery } from '@tanstack/react-query';
import { Card, ProgressBar } from '@ui-kitten/components';
import { QUERY_KEYS } from 'api/ApiConstants';
import UserAPI from 'api/UserAPI';
import { Colors, defaultStyles } from 'constants/styles';
import { DEFAULT_CURRENCY } from 'constants/txnConstants';
import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Home = () => {
  const { isLoading: isProfileLoading, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: UserAPI.getUserProfile,
    enabled: true,
    refetchInterval: false,
  });

  const { accountBalance, currency, fullName } = useMemo(() => {
    if (isProfileLoading) return { accountBalance: 0, currency: 'INR', fullName: '' };
    if (!!data) {
      const fullName = data?.data?.fullName || 'User';
      const accountBalance = data?.data?.accounts.reduce((acc: number, account: any) => acc + account.current_balance, 0);
      const currency = data?.data?.defaultCurrency?.symbol || DEFAULT_CURRENCY.symbol;
      return { accountBalance, currency, fullName };
    }
    return { accountBalance: 0, currency: 'INR', fullName: 'User' };
  }, [isProfileLoading, data]);

  return (
    <View>
      <Card style={defaultStyles.topCard}>
        <Text style={styles.labelText}>Welcome back 👋 </Text>
        <Text style={styles.nameText}>{fullName}</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.labelText}>Your current balance:</Text>
          <Text style={styles.currencyText}>
            {currency} {accountBalance}
          </Text>
        </View>
      </Card>
      {isProfileLoading && <ProgressBar />}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  labelText: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '400',
  },
  nameText: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
  },
  balanceContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  currencyText: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
  },
});
