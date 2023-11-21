import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios, { HttpStatusCode } from "axios";
import { Post, User } from "../types";

interface PostState {
  Posts: Post[] | null;
  isLoading: boolean;
  error: string | undefined;
}

const initialState: PostState = {
  Posts: null,
  isLoading: false,
  error: undefined,
};

export const fetchSinglePost = createAsyncThunk(
  "post/fetchSinglePost",
  async (id: number) => {
    const res = await axios({
      method: "get",
      url: `api/post/${id}`,
    });

    const post: Post = await res.data;
    return post;
  }
);

export const getFollowingPosts = createAsyncThunk(
  "post/getFollowingPosts",
  async (user: User) => {
    const res = await axios.post("api/post/feed", user);

    const posts: Post[] = await res.data;

    return posts;
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (post: Post) => {
    const res = await axios.post("api/post", post);

    const createdPost: Post = await res.data;
    return createdPost;
  }
);

// export const updateUser = createAsyncThunk(
//   "user/updateUser",
//   async (user: User) => {
//     console.log(user.Username);
//     await axios.put(`api/user`, user);
//     return HttpStatusCode.Accepted;
//   }
// );

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post: Post) => {
    await axios.delete(`api/post`, {
      headers: { "Content-Type": "application/json" },
      data: post,
    });
    return HttpStatusCode.Accepted;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSinglePost.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSinglePost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Posts?.push(action.payload);
    });
    builder.addCase(fetchSinglePost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(getFollowingPosts.fulfilled, (state, action) => {
      state.Posts = action.payload;
    });

    // builder.addCase(createUser.fulfilled, (state, action) => {
    //   state.User = action.payload;
    // });

    // builder.addCase(deleteUser.fulfilled, (state) => {
    //   state.User = null;
    // });
  },
});

// export const { getUser } = userSlice.actions;
export const selectPosts = (state: RootState) => state.post;
export default postSlice.reducer;
