import {
  createSlice,
  isAllOf,
  isAnyOf,
  isRejectedWithValue,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  authApi,
  CheckLoginFail,
  isLoginSuccess,
  LoginFail,
  LoginSuccess,
} from "./auth/authApi";
import { RootState } from "./store";

export const appSliceName = "app";
export interface MiscError {
  type: "misc";
  text: string;
}
export interface FetchError {
  type: "fetch";
  text: string;
  url: string;
  method: string;
}

export interface HttpError {
  type: "http";
  text: string;
  url: string;
  method: string;
  status: number;
}

export type NetworkErrorBase = MiscError | FetchError | HttpError;

export type NetworkError = NetworkErrorBase & {
  timestamp: number;
};

export type NetworkAction = string;

interface AppState {
  module: string | null;
  loginStatus: {
    user: string | null;
    expiry: string | null;
    isSuperUser: boolean;
    recaptchaKey: string | null;
    loggedIn: boolean;
  };
  networkError: NetworkError | null;
  pendingNetworkActions: NetworkAction[];
}

const initialState: AppState = {
  module: null,
  loginStatus: {
    user: null,
    expiry: null,
    isSuperUser: false,
    recaptchaKey: null,
    loggedIn: false,
  },
  networkError: null,
  pendingNetworkActions: [],
};

export const appSlice = createSlice({
  name: appSliceName,
  initialState,
  reducers: {
    setNetworkError: {
      reducer: (state, { payload }: PayloadAction<NetworkError, string>) => {
        /*Ignore 401/403 errors if not logged in*/
        if (
          !state.loginStatus.loggedIn &&
          payload.type === 'http' &&
          [401, 403].includes(payload.status)
        )
          return;
        state.networkError = payload;
      },
      prepare: (networkError: NetworkErrorBase) => ({
        payload: {
          ...networkError,
          timestamp: new Date().getTime(),
        },
      }),
    },
    clearNetworkError: (state) => void (state.networkError = null),
    setCurrentModule: (state, { payload }) => void (state.module = payload),
    addNetworkAction: (state, { payload }) => {
      if (!state.pendingNetworkActions.includes(payload))
        state.pendingNetworkActions.push(payload);
    },
    removeNetworkAction: (state, { payload }) => {
      if (state.pendingNetworkActions.includes(payload))
        state.pendingNetworkActions.splice(
          state.pendingNetworkActions.indexOf(payload),
          1
        );
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(
        isAnyOf(
          authApi.endpoints.checkLogin.matchFulfilled,
          authApi.endpoints.login.matchFulfilled
        ),
        (
          state: AppState,
          { payload }: { payload: LoginSuccess | LoginFail | CheckLoginFail }
        ) => {
          if (isLoginSuccess(payload)) {
            state.loginStatus = {
              user: payload.user,
              expiry: payload.expiry,
              isSuperUser: payload.is_superuser,
              recaptchaKey: payload.recaptcha_key,
              loggedIn: true,
            };
          }
        }
      )
      .addMatcher(
        isAllOf(
          authApi.endpoints.checkLogin.matchRejected,
          isRejectedWithValue
        ),
        (state, { payload }) => {
          if (
            typeof payload?.status === "number" &&
            [401, 403].includes(payload.status)
          ) {
            let data = payload.data as CheckLoginFail;
            state.loginStatus.recaptchaKey = data.recaptcha_key;
          }
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, () => {
        /*Not pure, but an exception here as I want to clear everything*/
        localStorage.clear();
        /*Page is refreshed on logout, to clear both Redux store and cached memory.*/
        window.location.reload();
      }),
});

export const {
  setNetworkError,
  clearNetworkError,
  setCurrentModule,
  addNetworkAction,
  removeNetworkAction,
} = appSlice.actions;

export const selectLoginStatus = (state: RootState) =>
  state[appSliceName].loginStatus;
export const selectNetworkError = (state: RootState) =>
  state[appSliceName].networkError;
export const selectCurrentModule = (state: RootState) =>
  state[appSliceName].module;
export const selectPendingNetworkActions = (state: RootState) =>
  state[appSliceName].pendingNetworkActions;
