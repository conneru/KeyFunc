import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { HttpStatusCode } from "axios";
import { axiosInstance as axios } from "../axiosInstance";
import { NewUser, User } from "../types";
import { REHYDRATE } from "redux-persist";

interface UserState {
  isAuthorized: boolean;
  userProfile: User | null;
}

const initialState: UserState = {
  isAuthorized: false,
  userProfile: null,
};

export const fetchSingleUser = createAsyncThunk(
  "user/setUser",
  async (id: number) => {
    const res = await axios({
      method: "get",
      url: `api/user/${id}`,
    });

    const user: User = await res.data;
    return user;
  }
);

export const getUserByUsername = createAsyncThunk(
  "user/getUsername",
  async (username: string | undefined, thunkAPI) => {
    const res = await axios({
      method: "get",
      url: `api/user/${username}`,
    });

    const user: User = await res.data;

    return thunkAPI.dispatch(setUserProfile(user));
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (user: User) => {
    const res = await axios.post("api/user", user);

    const createdUser: User = await res.data;
    return createdUser;
  }
);

interface IFollow {
  followUsername?: string | null;
  user: User | null;
}

export const followUser = createAsyncThunk(
  "user/followUser",
  async ({ followUsername, user }: IFollow, thunkAPI) => {
    const res = await axios({
      method: "post",
      url: `/api/user/follow/${followUsername}`,
      data: { Id: user?.id },
    });

    const followedUser: User = await res.data;
    return thunkAPI.dispatch(setUserProfile(followedUser));
  }
);
export const unfollowUser = createAsyncThunk(
  "user/unfollowUser",
  async ({ followUsername, user }: IFollow, thunkAPI) => {
    const res = await axios({
      method: "post",
      url: `/api/user/unfollow/${followUsername}`,
      data: { Id: user?.id },
    });

    const unfollowedUser: User = await res.data;

    return thunkAPI.dispatch(setUserProfile(unfollowedUser));
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (user: User) => {
    console.log(user.username);
    await axios.put(`api/user`, user);
    return HttpStatusCode.Accepted;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (user: User) => {
    await axios.delete(`api/user`, {
      headers: { "Content-Type": "application/json" },
      data: user,
    });
    return HttpStatusCode.Accepted;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authorizeUser: (state) => {
      state.isAuthorized = true;
    },
    unauthorizeUser: (state) => {
      state.isAuthorized = true;
    },

    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { authorizeUser, unauthorizeUser, setUserProfile } =
  userSlice.actions;
// export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
