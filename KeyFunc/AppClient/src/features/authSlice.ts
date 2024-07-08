import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authorizeUser } from "./userSlice";
import { axiosInstance as axios } from "../axiosInstance";
import { User, NewUser } from "../types";
import { getUserChats, setChats } from "./chatSlice";
import { RootState } from "../store";

interface AuthState {
  authExp: number | null;
  User: User | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: AuthState = {
  authExp: null,
  User: null,
  isLoading: true,
  error: undefined,
};

export const login = createAsyncThunk(
  "auth/Login",
  async (user: NewUser, thunkAPI) => {
    const res = await axios({
      method: "post",
      url: `api/auth/login`,
      data: user,
      withCredentials: true,
    });

    const updatedUser: User = await res.data;
    switch (res.status) {
      case 200:
        thunkAPI.dispatch(authorizeUser());
        thunkAPI.dispatch(setChats(updatedUser.chats));
        return thunkAPI.dispatch(setUser(updatedUser));
      default:
        return thunkAPI.dispatch(setUser(null));
    }
  }
);

export const refresh = createAsyncThunk("auth/Refresh", async (_, thunkAPI) => {
  const res = await axios({
    method: "get",
    url: `/api/auth/refresh`,
    withCredentials: true,
  });

  const state = (await thunkAPI.getState()) as RootState;

  const chatState = state.chat.Chats;

  const user: User = await res.data;
  // console.log(user);

  switch (res.status) {
    case 200:
      thunkAPI.dispatch(authorizeUser());
      if (!chatState?.length) {
        thunkAPI.dispatch(setChats(user.chats));
      }
      thunkAPI.dispatch(setUser(user));
      return 200;
    default:
      thunkAPI.dispatch(setUser(null));
      return 401;
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.User = null;
      state.authExp = null;
    },

    setUser: (state, action) => {
      if (action.payload != null) {
        state.authExp = new Date(Date.now() + 0.1 * 60000).getTime();
      }
      state.User = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(REHYDRATE, (state) => {
    // state.isLoading = true;
    // });
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    // builder.addCase(refresh.pending, (state) => {
    //   state.isLoading = true;
    // });
    // builder.addCase(refresh.fulfilled, (state, action) => {
    //   state.isLoading = false;
    // });
    builder.addCase(refresh.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
      state.User = null;
    });
  },
});

export const { logOut, setUser } = authSlice.actions;

export default authSlice.reducer;
