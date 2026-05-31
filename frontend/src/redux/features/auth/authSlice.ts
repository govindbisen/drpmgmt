import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../api/auth";

/* =========================
   TYPES
========================= */

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: any;
}

/* =========================
   INITIAL STATE
========================= */

const initialState: AuthState = {
  isAuthenticated: false,
  loading: true,
  error: null,
  user: null,
};

/* =========================
   LOGIN
========================= */

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await API.post("/auth/login", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  },
);

/* =========================
   REGISTER
========================= */

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: { username: string; password: string; email: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await API.post("/auth/signup", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Signup failed");
    }
  },
);

/* =========================
   ME (AUTO LOGIN CHECK)
========================= */

export const getCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/auth/me");
      return res.data;
    } catch (err: any) {
      return rejectWithValue("Not authenticated");
    }
  },
);

/* =========================
   SLICE
========================= */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= LOGIN ================= */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        // ❌ DO NOTHING HERE (IMPORTANT)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ================= REGISTER ================= */
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })

      /* ================= ME ================= */
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
