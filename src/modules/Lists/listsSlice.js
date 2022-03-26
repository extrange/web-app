import { createSlice } from "@reduxjs/toolkit";

export const listsPath = "lists";

const initialState = {
  currentList: null,
  showCompleted: false,
};

export const listsSlice = createSlice({
  name: listsPath,
  initialState,
  reducers: {
    setCurrentList: (state, { payload }) => void (state.currentList = payload),
    setShowCompleted: (state, { payload }) =>
      void (state.showCompleted = payload),
  },
});

export const { setCurrentList, setShowCompleted } = listsSlice.actions;

export const selectCurrentList = (state) => state[listsPath].currentList;
export const selectShowCompleted = (state) => state[listsPath].showCompleted;
