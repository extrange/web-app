import {createSelector, createSlice, nanoid} from "@reduxjs/toolkit";
import {isPlainObject} from 'lodash'

export const notificationsSliceName = 'notifications'

const shape = [
    'title',
    'content',
    'source',

    /*Autogenerated if not already present*/
    'id',
    'timestamp',
]

const prepareBatchNotification = (arg) => {
    if (isPlainObject(arg)) {
        return {
            payload: [{
                id: nanoid(),
                timestamp: Date.now(),
                ...arg
            }]
        }
    }
    if (!Array.isArray(arg))
        throw new Error(`'${arg}' should be an array or object, but got ${typeof arg}`)

    return {
        payload: arg.map(e => ({
            id: nanoid(),
            timestamp: Date.now(),
            ...e
        }))
    }
}

const validateShape = (arg) => {
    if (!arg.every(item => shape.every(e => Object.keys(item).includes(e))))
        throw new Error(`Invalid notification shape: expected ${shape}, but got ${Object.keys(arg)}`)
}

export const notificationSlice = createSlice({
    name: notificationsSliceName,
    initialState: [],
    reducers: {
        addNotifications: {
            reducer: (state, {payload}) => {
                validateShape(payload)
                state.push(...payload)
            },
            prepare: prepareBatchNotification
        },
        removeNotification: (state, {payload: {id}}) => state.filter(e => e.id !== id),
        removeNotificationsFromSource: (state, {payload}) => state.filter(e => e.source !== payload),
    },

})

export const {
    addNotifications,
    removeNotification,
    removeNotificationsFromSource
} = notificationSlice.actions

export const selectNotificationsSorted = createSelector(
    state => state[notificationsSliceName],
    items => items.slice().sort((a, b) => b.timestamp - a.timestamp)
)