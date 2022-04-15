import { createSlice, isAllOf, isRejectedWithValue } from "@reduxjs/toolkit";
import { NETWORK_ERROR } from "./constants";
import { authApi } from "./auth/authApi";

export const appSliceName = "app";

const initialState = {
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

const handleLoginFulfilled = (
  state,
  {
    payload: {
      user,
      expiry,
      is_superuser: isSuperUser,
      recaptcha_key: recaptchaKey,
    },
  }
) =>
  void (state.loginStatus = {
    user,
    expiry,
    isSuperUser,
    recaptchaKey,
    loggedIn: true,
  });

const setNetworkErrorReducer = (state, action) => {
  let {
    method = "Method not specified",
    url = "URL not specified",
    text = "",
    status = null /*Must be specified if HTTP_ERROR*/,
    type,
    timestamp,
  } = action.payload;

  /*Type not specified:  rejected thunk with value which is NOT a NetworkError object*/
  if (!type) {
    state.networkError = {
      method,
      url,
      text: JSON.stringify(action, undefined, 2),
      status,
      type,
      timestamp,
    };
    return;
  }

  if (type === NETWORK_ERROR.HTTP_ERROR && typeof status !== "number")
    throw new Error(`NetworkError: 'status' must be a number if 
            'type' === HTTP_ERROR, but got ${status} instead`);

  /*Ignore 401/403 errors if not logged in*/
  if (!state.loginStatus.loggedIn && [401, 403].includes(status)) {
    return;
  }
  state.networkError = { method, url, text, status, type, timestamp };
};

export const appSlice = createSlice({
  name: appSliceName,
  initialState,
  reducers: {
    setNetworkError: {
      reducer: setNetworkErrorReducer,
      prepare: (action) => ({
        payload: {
          ...action,
          timestamp: new Date().getTime(),
        },
      }),
    },
    clearNetworkError: (state) => void (state.networkError = null),
    setCurrentModule: (state, { payload }) => void (state.module = payload),
    setAppBar: (state, { payload: { drawerOpen = false } }) =>
      void (state.appBar.drawerOpen = drawerOpen),
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
        authApi.endpoints.checkLogin.matchFulfilled,
        handleLoginFulfilled
      )
      .addMatcher(
        isAllOf(
          authApi.endpoints.checkLogin.matchRejected,
          isRejectedWithValue
        ),
        (state, action) => {
          let payload = action.payload;
          if (
            payload.type === NETWORK_ERROR.HTTP_ERROR &&
            [401, 403].includes(payload.status)
          )
            state.loginStatus.recaptchaKey = payload.data.recaptcha_key;
        }
      )
      .addMatcher(authApi.endpoints.login.matchFulfilled, handleLoginFulfilled)
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
  setAppBar,
  addNetworkAction,
  removeNetworkAction,
} = appSlice.actions;

export const selectLoginStatus = (state) => state[appSliceName].loginStatus;
export const selectNetworkError = (state) => state[appSliceName].networkError;
export const selectCurrentModule = (state) => state[appSliceName].module;
export const selectPendingNetworkActions = (state) =>
  state[appSliceName].pendingNetworkActions;
