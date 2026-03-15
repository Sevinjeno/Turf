import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: number;
  email?: string;
  phone?: string;
  name?: string;
  role?: string;
  avatar?: string;
} | null;
interface AuthState {
  accessToken: string | null;
  user: User;
}

const authSlice = createSlice({
  name: "auth",
  initialState: { accessToken: null, user: null } as AuthState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
});
export const { setAccessToken, setUser, logout } = authSlice.actions; // will use dispatch

export default authSlice.reducer; //gives out the function
