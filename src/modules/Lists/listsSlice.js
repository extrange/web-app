import {createSlice} from "@reduxjs/toolkit";

export const listsSliceName = 'lists'

const initialState = {
    currentList: null
}

export const listsSlice = createSlice({
    name: listsSliceName,
    initialState,
    reducers: {
        setCurrentList: (state, {payload}) => void (state.currentList = payload)
    }
})

export const {
    setCurrentList
} = listsSlice.actions

export const selectCurrentList = state => state[listsSliceName].currentList