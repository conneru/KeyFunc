import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios, { HttpStatusCode } from "axios";
import { Message } from "../types";

// const initialState: MessageState = {
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

export const createMessage = createAsyncThunk(
  "message/createMessage",
  async (message: Message) => {
    const res = await axios.post("api/message", message);

    const createdMessage: Message = await res.data;
    return createdMessage;
  }
);

export const updateMessage = createAsyncThunk(
  "message/updateMessage",
  async (message: Message) => {
    await axios.put(`api/message`, message);
    return HttpStatusCode.Accepted;
  }
);

export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (message: Message) => {
    await axios.delete(`api/message`, {
      headers: { "Content-Type": "application/json" },
      data: message,
    });
    return HttpStatusCode.Accepted;
  }
);

// export const messageSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     // builder.addCase(fetchSingleUser.pending, (state) => {
//     //   state.isLoading = true;
//     // });
//     // builder.addCase(fetchSingleUser.fulfilled, (state, action) => {
//     //   state.isLoading = false;
//     //   state.User = action.payload;
//     // });
//     // builder.addCase(fetchSingleUser.rejected, (state, action) => {
//     //   state.isLoading = false;
//     //   state.error = action.error.message;
//     // });

//     // builder.addCase(createUser.fulfilled, (state, action) => {
//     //   state.User = action.payload;
//     // });

//     // builder.addCase(deleteUser.fulfilled, (state) => {
//     //   state.User = null;
//     // });
//   },
// });

// // export const { getUser } = userSlice.actions;
// export const selectUser = (state: RootState) => state.user;
// export default messageSlice.reducer;
