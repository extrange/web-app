import { createAsyncThunk } from "@reduxjs/toolkit";

export const throwAsyncThunkReject = createAsyncThunk(
  "testing/asyncThunkReject",
  async () => {
    throw new Error("Testing: AsyncThunkReject");
  }
);

export const throwAsyncThunkRejectWithValue = createAsyncThunk(
  "testing/asyncThunkRejectWithValue",
  async (arg, { rejectWithValue }) => {
    return rejectWithValue("Testing: AsyncThunkRejectWithValue");
  }
);
