import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { HttpStatusCode } from "axios";
import { CreatePost, NewUser, Post, User } from "../types";
import { axiosInstance as axios } from "../axiosInstance";
import { url } from "inspector";

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
  async (user: User, thunkAPI) => {
    try {
      const res = await axios.post("api/post/feed", user, {
        withCredentials: true,
      });

      const json = await res.data;
      console.log(json);

      const posts: Post[] = await res.data;
      thunkAPI.dispatch(setPosts(posts));
      return posts;
    } catch (e) {
      console.log(e);
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (post: CreatePost) => {
    post.ContentTypes = post.FileList.map((f) => f.type);
    console.log(post, "THIS IS TH EPSOT");
    try {
      const res = await axios.post("/api/post", post, {
        withCredentials: true,
      });
      const urls: string[] = await res.data;

      urls.forEach(async (url, idx) => {
        console.log(url);
        await axios.put(url, post.FileList[idx], {
          headers: {
            "Content-Type": post.FileList[idx].type,
          },
          withCredentials: false,
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
);

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
  reducers: {
    setPosts: (state, action) => {
      state.isLoading = false;
      if (state.Posts) {
        return {
          ...state,
          Posts: [...state.Posts, ...action.payload],
        };
      }
      return {
        ...state,
        Posts: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFollowingPosts.rejected, (state, action) => {
      console.log(action.payload);
    });
  },
});

export const { setPosts } = postSlice.actions;
export const selectPosts = (state: RootState) => state.post;
export default postSlice.reducer;
