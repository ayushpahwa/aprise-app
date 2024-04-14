import * as SecureStore from "expo-secure-store";
import { debug } from "loglevel";

export enum LocalStoreKeys {
  AUTH_TOKEN = "AUTH_TOKEN",
}

export const storeDataToLocalStore = async (
  key: LocalStoreKeys,
  value: string | object,
) => {
  try {
    if (typeof value === "object") value = JSON.stringify(value);
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    // saving error
    debug("Error saving data:", e);
  }
};

export const getDataFromLocalStore = async (key: LocalStoreKeys) => {
  try {
    const value = await SecureStore.getItemAsync(key);
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
    debug("Error reading data:", e);
    return null;
  }
};

export const removeDataFromLocalStore = async (key: LocalStoreKeys) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    // error reading value
    debug("Error removing data:", e);
  }
};
