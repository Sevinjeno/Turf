// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import citySlice from './features/citySlice';
import adminSlice from './features/admin/adminslice';
import userSlice from './features/user/UserSlice';
import { useDispatch } from 'react-redux';


const store = configureStore({
    reducer: {
      city: citySlice, // Register the city slice reducer
      admin: adminSlice, // Register the admin slice reducer
      user:userSlice,// Register the user slice reducer
    },
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;