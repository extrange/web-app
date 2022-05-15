import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { listsPath, listsSlice } from "../modules/Lists/listsSlice";
import {
  literaturePath,
  literatureSlice,
} from "./../modules/Literature/literatureSlice";
import { appSlice, appSliceName as appPath } from "./appSlice";
import { baseApi } from "./network-core/baseApi";
import { networkLoadingMiddleware } from "./network-loading/networkLoadingMiddleware";
import {
  notificationSlice,
  notificationsSliceName as notificationsPath,
} from "./notifications/notificationSlice";

const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  [appPath]: appSlice.reducer,
  [notificationsPath]: notificationSlice.reducer,
  [listsPath]: listsSlice.reducer,
  [literaturePath]: literatureSlice.reducer,
};

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(networkLoadingMiddleware),
});

const rootReducer = combineReducers(reducer);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
