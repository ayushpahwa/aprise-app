import AsyncStorage from '@react-native-async-storage/async-storage';

export enum LocalStoreKeys {
  AUTH_TOKEN = 'AUTH_TOKEN',
}

export const storeDataToLocalStore = async (key: LocalStoreKeys, value: string | object) => {
  try {
    if (typeof value === 'object') value = JSON.stringify(value);
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
    console.log('Error saving data:', e);
  }
};

export const getDataFromLocalStore = async () => {
  try {
    const value = await AsyncStorage.getItem('my-key');
    if (value !== null) {
      // check if value is an object
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  } catch (e) {
    // error reading value
    console.log('Error reading data:', e);
  }
};
