import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Tech_Logit from "../../API/config";

export const fetchProjects = createAsyncThunk("fetchProjects", async () => {
  const { data } = await Tech_Logit.get(`Projects`);
  return data;
});
export const fetchProjectsCategories = createAsyncThunk(
  "fetchProjectsCategories",
  async () => {
    const { data } = await Tech_Logit.get(`projectsCategories`);
    return data;
  }
);

const initialState = {
  projects: [],
  projectsCategories:[],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchProjects.fulfilled]: (state, action) => {
      state.loading = false;
      state.projects = action.payload;
    },
    [fetchProjectsCategories.fulfilled]: (state, action) => {
      state.loading = false;
      state.projectsCategories = action.payload;
    },
  },
});
export default projectsSlice.reducer;
