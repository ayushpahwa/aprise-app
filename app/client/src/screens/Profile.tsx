import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { Button } from '@ui-kitten/components';
import { AuthContext } from 'store/AuthContext';

const Profile = () => {
  const { removeToken } = useContext(AuthContext);
  return (
    <View>
      <Text>Profile</Text>
      <Button onPress={removeToken}>Logout</Button>
    </View>
  );
};

export default Profile;
