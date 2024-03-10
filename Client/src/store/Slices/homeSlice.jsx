import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Tech_Logit from "../../API/config";

export const fetchHome = createAsyncThunk("home/fetchHome", async () => {
  const { data } = await Tech_Logit.get(`home`);
  return data;
});

const initialState = {
  home: "",
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchHome.fulfilled]: (state, action) => {
      state.loading = false;
      state.home = { ...action.payload };
    },
  },
});
export const getHomeContent = (state) => state.home?.home;
export default homeSlice.reducer;
