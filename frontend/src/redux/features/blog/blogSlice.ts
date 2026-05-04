import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Blog {
  id: number;
  title: string;
  content: string;
  image_url?: string;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
};

export const fetchBlogs = createAsyncThunk("blog/fetch", async () => {
  const res = await axios.get("http://127.0.0.1:8000/blogs");
  return res.data;
});

export const createBlog = createAsyncThunk(
  "blog/create",
  async (
    data: { title: string; content: string },
    { getState }
  ) => {
    const state: any = getState();
    const token = state.auth.token;

    const res = await axios.post(
      "http://127.0.0.1:8000/blogs",
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      });
  },
});

export default blogSlice.reducer;