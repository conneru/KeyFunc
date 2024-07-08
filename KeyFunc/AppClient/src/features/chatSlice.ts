import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { HttpStatusCode } from "axios";
import { axiosInstance as axios } from "../axiosInstance";
import { Chat, Message, User } from "../types";
import { REHYDRATE } from "redux-persist";
import thunk from "redux-thunk";
import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";

interface ChatState {
  Chats: Chat[] | null;
  currChat: Chat | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: ChatState = {
  Chats: null,
  currChat: null,
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

export const setSingleChat = createAsyncThunk(
  "chat/setSingleChat",
  async (id: string, thunkAPI) => {
    return thunkAPI.dispatch(setCurrChat(id));
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

export const viewMsg = createAsyncThunk(
  "chat/viewMsg",
  async ({ msg, user }: { msg: Message; user: User }, thunkAPI) => {
    const res = await axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `/api/message/view`,
      data: {
        Id: msg.id,
        UserId: user.id,
        Content: msg.content,
        ChatId: msg.chatId,
        CreatedAt: msg.createdAt,
      },
      withCredentials: true,
    });
    const state = (await thunkAPI.getState()) as RootState;

    const chatState = state.chat.Chats;

    const newMsg: Message = await res.data;

    const chatIdx: number =
      chatState?.findIndex((c) => c.id === msg.chatId) || 0;

    const chat: Chat | undefined = chatState?.[chatIdx];

    if (chat?.messages) {
      const newChat: Chat = {
        id: chat?.id,
        name: chat?.name,
        image: chat?.image,
        type: chat?.type,
        users: chat?.users,
      };

      if (chat?.messages) {
        newChat.messages = [newMsg, ...chat.messages.slice(1)];
      }

      const newChatState: Chat[] | undefined = chatState
        ?.slice(0, chatIdx)
        .concat([newChat])
        .concat(chatState?.slice(chatIdx + 1));

      await thunkAPI.dispatch(addMessage(newChatState));
    }

    return;
  }
);

export const getMessages = createAsyncThunk(
  "chat/getMsg",
  async ({ msg, user }: { msg: Message; user: User }, thunkAPI) => {
    const res = await axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `/api/message/more`,
      data: {
        Id: msg.id,
        UserId: user.id,
        Content: msg.content,
        ChatId: msg.chatId,
        CreatedAt: msg.createdAt,
      },
      withCredentials: true,
    });

    const messages: Message[] = await res.data;
    console.log(messages);
    const state = (await thunkAPI.getState()) as RootState;

    const chatState = state.chat.Chats;

    const chatIdx: number =
      chatState?.findIndex((c) => c.id === msg.chatId) || 0;

    const chat: Chat | undefined = chatState?.[chatIdx];

    const newChat: Chat = {
      id: chat?.id,
      name: chat?.name,
      image: chat?.image,
      type: chat?.type,
      users: chat?.users,
    };
    const newChatState: Chat[] | undefined = chatState
      ?.slice(0, chatIdx)
      .concat([newChat])
      .concat(chatState?.slice(chatIdx + 1));

    if (chat?.messages) {
      newChat.messages = [
        ...chat.messages.slice(0, chat.messages.length - 1),
        ...messages,
      ];
    }

    await thunkAPI.dispatch(addMessage(newChatState));

    return;
  }
);

export const addMsg = createAsyncThunk(
  "chat/addMsg",
  async (msg: Message, thunkAPI) => {
    const state = (await thunkAPI.getState()) as RootState;

    const chatState = state.chat;

    try {
      console.log(chatState, msg.chatId);
      const chatIdx: number =
        chatState.Chats?.findIndex((c) => c.id === msg.chatId) || 0;

      const chat: Chat | undefined = chatState.Chats?.[chatIdx];

      const newChat: Chat = {
        id: chat?.id,
        name: chat?.name,
        image: chat?.image,
        type: chat?.type,
        users: chat?.users,
      };
      if (chat?.messages) {
        newChat.messages = [msg, ...chat.messages];
      }

      console.log("made it this far");
      const newChatState: Chat[] | undefined = chatState.Chats?.slice(
        0,
        chatIdx
      ).concat(chatState.Chats?.slice(chatIdx + 1));

      console.log(chat, newChatState, newChat, msg, chatState, chatIdx);

      if (chat && newChatState) {
        newChatState?.unshift(newChat);
        thunkAPI.dispatch(addMessage(newChatState));
      }
    } catch (e) {
      console.log(e);
    }
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
        isLoading: false,
      };
    },

    setCurrChat: (state, action) => {
      return {
        ...state,
        currChat:
          state.Chats?.find((c) => c.id?.toString() === action.payload) || null,
      };
    },

    addMessage: (state, action) => {
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

    builder.addCase(addMsg.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(setSingleChat.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createChat.fulfilled, (state, action) => {});

    builder.addCase(REHYDRATE, (state, action) => {});
  },
});

export const { setChats, setCurrChat, addMessage } = chatSlice.actions;
export const selectUser = (state: RootState) => state.chat;
export default chatSlice.reducer;
