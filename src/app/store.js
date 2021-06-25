import {configureStore} from "@reduxjs/toolkit";
import {appSlice} from "./appSlice";
import {baseApi} from "./network-core/baseApi";
import {networkErrorMiddleware} from "./network-error/networkErrorMiddleware";
import {setupListeners} from "@reduxjs/toolkit/query";
import {notificationSlice} from "./notifications/notificationSlice";
import {listsSlice} from "../modules/Lists/listsSlice";

export const store =  configureStore({
    reducer: {
        app: appSlice.reducer,
        notifications: notificationSlice.reducer,
        lists: listsSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(networkErrorMiddleware)
})

setupListeners(store.dispatch)