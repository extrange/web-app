import {configureStore} from "@reduxjs/toolkit";
import {appSlice, appSliceName as appPath} from "./appSlice";
import {baseApi} from "./network-core/baseApi";
import {networkErrorMiddleware} from "./network-error/networkErrorMiddleware";
import {setupListeners} from "@reduxjs/toolkit/query";
import {notificationSlice, notificationsSliceName as notificationsPath} from "./notifications/notificationSlice";
import {listsSlice, listsSliceName as listsPath} from "../modules/Lists/listsSlice";
import { networkLoadingMiddleware } from "./network-loading/networkLoadingMiddleware";

export const store =  configureStore({
    reducer: {
        [appPath]: appSlice.reducer,
        [notificationsPath]: notificationSlice.reducer,
        [listsPath]: listsSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(networkErrorMiddleware)
            .concat(networkLoadingMiddleware)
})

setupListeners(store.dispatch)