import {configureStore} from "@reduxjs/toolkit";
import {appSlice} from "./appSlice";
import {baseApi} from "../core/network/baseApi";
import {networkErrorMiddleware} from "../core/network/networkErrorMiddleware";
import {setupListeners} from "@reduxjs/toolkit/query";
import {notificationSlice} from "./notifications/notificationSlice";

export const store =  configureStore({
    reducer: {
        app: appSlice.reducer,
        notifications: notificationSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(networkErrorMiddleware)
})

setupListeners(store.dispatch)