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

export const getDataFromLocalStore = async (key: LocalStoreKeys) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // check if value is an object
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return null;
  } catch (e) {
    // error reading value
    console.log('Error reading data:', e);
    return null;
  }
};

export const removeDataFromLocalStore = async (key: LocalStoreKeys) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // error reading value
    console.log('Error removing data:', e);
  }
};
