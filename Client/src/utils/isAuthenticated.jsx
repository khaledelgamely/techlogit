import Cookies from "js-cookie";
import React from "react";
import { Navigate, Route } from "react-router-dom";

export const IsAuthenticated = ({ children }) => {
  const isAuthenticated = !!Cookies.get("token");
  if (!isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" />;
  }
};
