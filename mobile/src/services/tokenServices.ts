import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "refresh_token";

export const saveRefreshToken = async (token: string) => {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = async () => {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const clearTokens = async () => {
  return SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};