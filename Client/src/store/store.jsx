import { configureStore } from "@reduxjs/toolkit";
import userData from "./Slices/userSlice";
import homeData from "./Slices/homeSlice";
import userServices from "./Slices/servicesSlice";
import projectsData from "./Slices/projectSlice";
import currencySlice from "./Slices/currency";

const store = configureStore({
  reducer: {
    user: userData,
    services: userServices,
    home: homeData,
    projects: projectsData,
    currency: currencySlice,
  },
});

export default store;
