import {
  createSlice,
  createAsyncThunk,
  createAction,
  createReducer,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios, { HttpStatusCode } from "axios";
import { NewUser, User } from "../types";

interface AuthState {
  authExp: number | null;
  User: User | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: AuthState = {
  authExp: null,
  User: null,
  isLoading: false,
  error: undefined,
};

export const login = createAsyncThunk("auth/Login", async (user: User) => {
  const res = await axios({
    method: "post",
    url: `api/auth/login`,
    data: user,
    withCredentials: true,
  });

  const updatedUser: User = await res.data;
  switch (res.status) {
    case 200:
      return updatedUser;
    default:
      return null;
  }
});

export const refresh = createAsyncThunk("auth/Refresh", async () => {
  const res = await axios({
    method: "get",
    url: `api/auth/refresh`,
    withCredentials: true,
  });

  const user: User = await res.data;
  switch (res.status) {
    case 200:
      return user;
    default:
      return null;
  }
});

// export const logUserOut = createAction("USER_LOGOUT")

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOut: (state) => {
      state.User = null;
      state.authExp = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.authExp = new Date(Date.now() + 60000).getTime();
      state.User = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(refresh.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(refresh.fulfilled, (state, action) => {
      state.isLoading = false;
      state.authExp = new Date(Date.now() + 60000).getTime();
      state.User = action.payload;
    });
    builder.addCase(refresh.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
      state.User = null;
    });
  },
});

export const { logOut } = authSlice.actions;

export default authSlice.reducer;
