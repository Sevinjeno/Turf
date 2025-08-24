import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAdminApi, loginAdminApi } from "./services";
import { LoginCredentials } from "./types";

export const LoginAdmin = createAsyncThunk<any,LoginCredentials>("admin/login",
    async(credentials,{rejectWithValue})=>{
    try{
      const response= await loginAdminApi(credentials);
      return response;
    }catch(error:any){
        return rejectWithValue(error.response.data||"Login failed, please try again later");
    }

})

export const fetchAdmin = createAsyncThunk(
  'admin/fetchAdmin',
  async (_, { rejectWithValue }) => {
    try{
      const response= await fetchAdminApi();
      return response;
    }catch(error:any){
        return rejectWithValue(error.response.data||"Login failed, please try again later");
    }
  }
);