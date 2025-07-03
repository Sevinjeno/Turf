// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import citySlice from './features/citySlice';


const store = configureStore({
    reducer: {
      city: citySlice, // Register the city slice reducer
    },
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;