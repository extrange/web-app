import {createSlice} from "@reduxjs/toolkit";

const name = 'lists'

const initialState = {
    currentList: null
}

export const listsSlice = createSlice({
    name,
    initialState,
    reducers: {
        setCurrentList: (state, {payload}) => void (state.currentList = payload)
    }
})

export const {
    setCurrentList
} = listsSlice.actions

export const selectCurrentList = state => state[name].currentList