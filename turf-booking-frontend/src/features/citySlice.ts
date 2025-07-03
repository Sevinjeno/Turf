import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface City {
    display_name: string;
    type: string;
    osm_type: string;
  }

  interface CityState {
    query: string;
    cities: City[];
    lat: number | null;
    lon: number | null;
  }


  const initialState: CityState = {
    query: '',
    cities: [],
    lat: null,
    lon: null,
  };

  const citySlice = createSlice({
    name: 'city',
    initialState,
    reducers: {
      setQuery(state, action: PayloadAction<string>) { 
        state.query = action.payload; // Update the search query
      },
      setCities(state, action: PayloadAction<City[]>) {
        state.cities = action.payload; // Update the cities list
      },
      setCityCoordinates(state, action: PayloadAction<{ lat: number; lon: number }>) {
        state.lat = action.payload.lat;
        state.lon = action.payload.lon;
      },
    },
  });

export const { setQuery, setCities, setCityCoordinates } = citySlice.actions; // Export actions
export default citySlice.reducer; // Export reducer