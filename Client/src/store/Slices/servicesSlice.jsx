import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Tech_Logit from "../../API/config";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const { data } = await Tech_Logit.get("/categories");
    return data;
  }
);
export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (id) => {
    const { data } = await Tech_Logit.get(`/services/${id}/allservices`);
    return data;
  }
);
export const fetchSingleServices = createAsyncThunk(
  "services/fetchSingleServices",
  async (id) => {
    const { data } = await Tech_Logit.get(`/services/${id}`);
    return data;
  }
);

const initialState = {
  loading: true,
  categories: null,
  services: [],
  singleService: {},
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    addFirstServices: (state, action) => {
      state.services = { ...action.payload };
    },
  },
  extraReducers: {
    [fetchCategories.fulfilled]: (state, action) => {
      state.loading = false;
      state.categories = [...action.payload];
    },
    [fetchServices.pending]: (state) => {
      state.services = [];
    },
    [fetchServices.fulfilled]: (state, action) => {
      state.loading = true;
      state.services = [...action.payload];
    },
    [fetchServices.rejected]: (state) => {
      state.services = null;
    },
    [fetchSingleServices.fulfilled]: (state, action) => {
      state.loading = false;
      state.singleService = { ...action.payload };
    },
  },
});

export const { addFirstServices } = servicesSlice.actions;

export default servicesSlice.reducer;
