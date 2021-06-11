import {configureStore} from "@reduxjs/toolkit";
import {appSlice} from "./appSlice";
import {baseApi} from "./baseApi";
import {networkErrorMiddleware} from "./networkErrorMiddleware";

/*Page is refreshed on logout, to clear both Redux store and cached memory.*/

export default configureStore({
    reducer: {
        app: appSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(networkErrorMiddleware)
})