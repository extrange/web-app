import { createSlice } from "@reduxjs/toolkit";

export const listsPath = "lists";

const initialState = {
  currentList: null,
};

export const listsSlice = createSlice({
  name: listsPath,
  initialState,
  reducers: {
    setCurrentList: (state, { payload }) => void (state.currentList = payload),
  },
});

export const { setCurrentList } = listsSlice.actions;

export const selectCurrentList = (state) => state[listsPath].currentList;
