// src/utils/secureStore.ts

import * as SecureStore from "expo-secure-store";

export const setToken = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const getToken = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export const removeToken = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};