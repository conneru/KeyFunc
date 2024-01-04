import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { HttpStatusCode } from "axios";
import { axiosInstance as axios } from "../axiosInstance";
import { Chat, User } from "../types";

interface ChatState {
  Chats: Chat[] | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: ChatState = {
  Chats: null,
  isLoading: false,
  error: undefined,
};

export const getSingleChat = createAsyncThunk(
  "chat/getSingleChat",
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

export const getUserChats = createAsyncThunk(
  "chat/getUserChats",
  async (user: User, thunkAPI) => {
    const res = await axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `api/chat/all`,
      data: {
        user,
      },
      withCredentials: true,
    });

    const chats: Chat[] = await res.data;
    console.log(res.data);
    return thunkAPI.dispatch(setChats(chats));
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
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      return {
        ...state,
        Chats: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSingleChat.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSingleChat.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(getSingleChat.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(createChat.fulfilled, (state, action) => {});
  },
});

export const { setChats } = chatSlice.actions;
export const selectUser = (state: RootState) => state.chat;
export default chatSlice.reducer;
