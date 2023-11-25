import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios, { HttpStatusCode } from "axios";
import { Chat } from "../types";

interface ChatState {
  Chat: Chat | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: ChatState = {
  Chat: null,
  isLoading: false,
  error: undefined,
};

export const fetchSingleChat = createAsyncThunk(
  "user/fetchSingleChat",
  async (id: number) => {
    const res = await axios({
      method: "get",
      url: `api/chat/${id}`,
      withCredentials: true,
    });

    const chat: Chat = await res.data;
    return chat;
  }
);

export const createChat = createAsyncThunk(
  "chat/createChat",
  async (chat: Chat) => {
    const res = await axios.post("api/chat", chat);

    const createdUser: Chat = await res.data;
    return createdUser;
  }
);

export const updateChat = createAsyncThunk(
  "chat/updateChat",
  async (chat: Chat) => {
    await axios.put(`api/chat`, chat);
    return HttpStatusCode.Accepted;
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chat: Chat) => {
    await axios.delete(`api/chat`, {
      headers: { "Content-Type": "application/json" },
      data: chat,
    });
    return HttpStatusCode.Accepted;
  }
);

export const chatSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSingleChat.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSingleChat.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Chat = action.payload;
    });
    builder.addCase(fetchSingleChat.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(createChat.fulfilled, (state, action) => {
      state.Chat = action.payload;
    });

    // builder.addCase(deleteUser.fulfilled, (state) => {
    //   state.User = null;
    // });
  },
});

// export const { getUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.chat;
export default chatSlice.reducer;
