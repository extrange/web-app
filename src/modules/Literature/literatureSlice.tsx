import { createSlice } from "@reduxjs/toolkit";
import { BOOK_FIELDS } from "./schema";

export const literaturePath = "literature";

const initialState = {
  submodule: null,
  displayedColumns: {
    [BOOK_FIELDS.image_url]: true,
    [BOOK_FIELDS.title]: true,
    [BOOK_FIELDS.authors]: true,
    [BOOK_FIELDS.genres]: true,
  },
};

export const literatureSlice = createSlice({
  name: literaturePath,
  initialState,
  reducers: {
    setLiteratureSubmodule: (state, { payload }) =>
      void (state.submodule = payload),
    setDisplayedColumn: {
      reducer: (state, { payload: { column, display } }) =>
        void (state.displayedColumns[column] = display),
      prepare: (column, display) => ({ payload: { column, display } }),
    },
  },
});

export const { setLiteratureSubmodule, setDisplayedColumn } =
  literatureSlice.actions;

export const selectLiteratureSubmodule = (state) =>
  state[literaturePath].submodule;
export const selectDisplayedColumns = (state) =>
  state[literaturePath].displayedColumns;
