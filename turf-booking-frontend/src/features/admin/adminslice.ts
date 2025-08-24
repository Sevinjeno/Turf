import { createSlice } from "@reduxjs/toolkit";
import { fetchAdmin, LoginAdmin } from "./middleware";
import { AdminState } from "./types";

const initialState:AdminState = {
    admin: null,
    loading: false,
    error: null,
    name:""
}

const adminSlice= createSlice({
    name: "admin",
    initialState,
    reducers:{
        logoutAdmin: (state) => {
            state.admin = null;
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(LoginAdmin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(LoginAdmin.fulfilled,(state,action)=>{
            state.admin = action.payload;
            state.loading = false;
            state.error = null;
        })
        builder.addCase(LoginAdmin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || "Login failed, please try again later";
        })

        // fetch admin
         .addCase(fetchAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.admin = null;
        state.loading = false;
        state.error = action.payload as string || "Session expired";
      });
    },
})

export const { logoutAdmin } = adminSlice.actions; //this is for dispatching actions in components

export default adminSlice.reducer; //this for store.js