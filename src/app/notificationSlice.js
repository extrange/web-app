import {createSelector, createSlice} from "@reduxjs/toolkit";
import {nanoid} from "nanoid";
import {sortBy} from 'lodash'

export const notificationSlice = createSlice({
    name: 'notifications',
    initialState: [],
    reducers: {
        addNotification: {
            reducer: (state, {
                payload: {
                    id,
                    source,
                    title,
                    content,
                }
            }) => void (state.push({
                id,
                source,
                title,
                content,
                timestamp: Date.now()
            }))
            ,
            prepare: (...args) => ({
                id: nanoid(),
                ...args
            })
        },
        removeNotification: (state, {payload: {id}}) => state.filter(e => e.id !== id),
        removeNotificationFromSource: (state, {payload: {source}}) => state.filter(e => e.source !== source),

    }
})

export const {
    addNotification,
    removeNotification,
    removeNotificationFromSource
} = notificationSlice.actions

export const selectNotificationsSorted = createSelector(
    state => state,
    items => sortBy(items, ['source', 'timestamp'])
)