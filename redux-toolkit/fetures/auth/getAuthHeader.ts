import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// thunk to get auth token
export const getAuthToken = () => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    throw new Error("No auth token found");
  }
  return jwt;
};

// get auth headers
export const getAuthHeaders = () => {
  const jwt = getAuthToken();
  return {
    Authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
  };
};
