// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import citySlice from './features/citySlice';
import adminSlice from './features/admin/adminslice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './features/auth/authSlice';


const store = configureStore({
    reducer: {
      city: citySlice, // Register the city slice reducer
      admin: adminSlice, // Register the admin slice reducer
      auth:authSlice,
    },
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;