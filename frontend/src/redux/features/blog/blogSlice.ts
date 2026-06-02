import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/axiosConfig";

interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  username: string;
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
  const res = await API.get("/blogs");
  return res.data;
});

export const createBlog = createAsyncThunk(
  "blog/create",
  async (data: { title: string; content: string }) => {
    const res = await API.post("/blogs", data);
    return res.data;
  },
);

export const updateBlog = createAsyncThunk(
  "blog/update",
  async ({
    id,
    title,
    content,
    category,
  }: {
    id: number;
    title: string;
    content: string;
    category: string;
  }) => {
    const res = await API.put(`/blogs/${id}`, {
      title,
      content,
      category,
    });

    return res.data;
  },
);

export const uploadBlogImage = createAsyncThunk(
  "blog/uploadImage",
  async ({ blogId, file }: { blogId: number; file: File }) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await API.post(`/blogs/${blogId}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },
);

export const deleteBlog = createAsyncThunk(
  "blog/delete",
  async (id: number) => {
    await API.delete(`/blogs/${id}`);
    return id;
  },
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
      })

      .addCase(updateBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.map((blog) =>
          blog.id === action.payload.id ? action.payload : blog,
        );
      })

      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
