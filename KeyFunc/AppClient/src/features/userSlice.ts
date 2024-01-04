import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { HttpStatusCode } from "axios";
import { axiosInstance as axios } from "../axiosInstance";
import { NewUser, User } from "../types";

interface UserState {
  isAuthorized: boolean;
}

const initialState: UserState = {
  isAuthorized: false,
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

export const createUser = createAsyncThunk(
  "user/createUser",
  async (user: NewUser) => {
    const res = await axios.post("api/user", user);

    const createdUser: User = await res.data;
    return createdUser;
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
  },
});

export const { authorizeUser, unauthorizeUser } = userSlice.actions;
// export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
