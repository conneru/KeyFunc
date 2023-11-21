// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../store";
// import axios, { HttpStatusCode } from "axios";

// const initialState: ImageState = {
//   Message: null,
//   isLoading: false,
//   error: undefined,
// };

// export const fetchSingleUser = createAsyncThunk(
//   "user/fetchSingleUser",
//   async (id: number) => {
//     const res = await axios({
//       method: "get",
//       url: `api/user/${id}`,
//     });

//     const user: User = await res.data;
//     return user;
//   }
// );

// export const createUser = createAsyncThunk(
//   "user/createUser",
//   async (user: NewUser) => {
//     const res = await axios.post("api/user", user);

//     const createdUser: User = await res.data;
//     return createdUser;
//   }
// );

// export const updateUser = createAsyncThunk(
//   "user/updateUser",
//   async (user: User) => {
//     console.log(user.Username);
//     await axios.put(`api/user`, user);
//     return HttpStatusCode.Accepted;
//   }
// );

// export const deleteUser = createAsyncThunk(
//   "user/deleteUser",
//   async (user: User) => {
//     await axios.delete(`api/user`, {
//       headers: { "Content-Type": "application/json" },
//       data: user,
//     });
//     return HttpStatusCode.Accepted;
//   }
// );

// export const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchSingleUser.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(fetchSingleUser.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.User = action.payload;
//     });
//     builder.addCase(fetchSingleUser.rejected, (state, action) => {
//       state.isLoading = false;
//       state.error = action.error.message;
//     });

//     builder.addCase(createUser.fulfilled, (state, action) => {
//       state.User = action.payload;
//     });

//     builder.addCase(deleteUser.fulfilled, (state) => {
//       state.User = null;
//     });
//   },
// });

// // export const { getUser } = userSlice.actions;
// export const selectUser = (state: RootState) => state.user;
// export default userSlice.reducer;
export default 1;
