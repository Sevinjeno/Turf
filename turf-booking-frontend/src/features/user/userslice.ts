import { createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "./middleware";

type User={
data:any
}

const initialState = {
    user: null as User | null,
    loading: false,
    error: null as string | null,
    name:""
}


const userSlice= createSlice({
    name: "user",
    initialState,
    reducers:{
        logoutAdmin: (state) => {
            state.user = null;
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchUser.fulfilled,(state,action)=>{
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        })
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || "Failed to fetch user data";})
      
    },
})

export const { logoutAdmin } = userSlice.actions; //this is for dispatching actions in components

export default userSlice.reducer; //this for store.js