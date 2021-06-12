import {configureStore} from "@reduxjs/toolkit";
import {appSlice} from "./appSlice";
import {baseApi} from "./baseApi";
import {networkErrorMiddleware} from "./networkErrorMiddleware";
import {setupListeners} from "@reduxjs/toolkit/query";

export const store =  configureStore({
    reducer: {
        app: appSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(networkErrorMiddleware)
})

setupListeners(store.dispatch)