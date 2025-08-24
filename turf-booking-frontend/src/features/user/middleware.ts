import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserApi } from "./service";

export const fetchUser=createAsyncThunk('user/fetchUser',async (_, { rejectWithValue }) => {
  try { 
    const response = await fetchUserApi();
    console.log("response",response)
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response.data || "Failed to fetch user data");
  }
}
);



