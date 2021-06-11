import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {LOGOUT_URL} from "./urls";
import {CURRENT_MODULE, NETWORK_ERROR, NETWORK_METHOD} from "./constants";
import {authApi} from "./authApi";

const initialState = {
    currentModule: localStorage.getItem(CURRENT_MODULE),
    loginStatus: {
        user: null,
        expiry: null,
        isSuperUser: false,
        recaptchaKey: null,
        loggedIn: false,
    },
    networkError: null,
}

export const send = () => {
}

/**
 * Convenience methods for obtaining get, add, update and delete methods from a URL
 * These must be dispatched with
 *
 * <pre>
 * get: function(...params) => url(...params)
 * add: function(object, ...params) => url(...params)
 * update: function (object, id, ...params) => detailUrl(id, ...params)
 * del: function (id, ...params) => detailUrl(id, ...params)
 * </pre>
 *
 * @param url str or function(...params) => url to obtain object list
 * @param detailUrl function(id, ...params) => url to obtain object details
 * @returns {[function(): Promise<unknown>, function(*=): Promise<unknown>, function(*=): Promise<unknown>, function(*=): Promise<unknown>]}
 */
export const crudMethods = (url, detailUrl) => {
    let get = (...params) => send(
        typeof url === 'function' ?
            url(...params) :
            url,
        {method: NETWORK_METHOD.GET});

    let add = (object, ...params) => send(
        typeof url === 'function' ?
            url(...params) :
            url,
        {
            method: NETWORK_METHOD.POST,
            body: JSON.stringify(object),
        });

    let update = (object, id, ...params) => send(
        detailUrl(id, ...params),
        {
            method: NETWORK_METHOD.PUT,
            body: JSON.stringify(object),
        });

    let del = (id, ...params) => send(
        detailUrl(id, ...params),
        {method: NETWORK_METHOD.DELETE}); //Note - for a DELETE operation, nothing is returned by the server

    return [get, add, update, del]
}

const handleLoginFulfilled = (state, {
    payload: {
        user,
        expiry,
        is_superuser: isSuperUser,
        recaptcha_key: recaptchaKey
    }

}) => void (state.loginStatus = {
    user,
    expiry,
    isSuperUser,
    recaptchaKey,
    loggedIn: true,
})

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setNetworkError: (state, {
            payload: {
                method = 'Method not specified',
                url = 'URL not specified',
                text = '',
                status = null, /*Must be specified if HTTP_ERROR*/
                type
            }
        }) => {
            if (type === NETWORK_ERROR.HTTP_ERROR && typeof status !== 'number')
                throw new Error(`NetworkError: 'status' must be a number if 
            'type' === HTTP_ERROR, but got ${status} instead`)

            /*Ignore 401/403 errors if not logged in*/
            if (!state.loginStatus.loggedIn &&
                [401, 403].includes(status)) {
                return
            }
            state.networkError = {method, url, text, status, type}
        },
        clearNetworkError: state => void (state.networkError = null),
        setCurrentModule: (state, {payload}) => {
            localStorage.setItem(CURRENT_MODULE, payload) // todo impure
            state.currentModule = payload
        }
    },
    extraReducers: builder => builder
        .addMatcher(authApi.endpoints.checkLogin.matchFulfilled, handleLoginFulfilled)
        .addMatcher(authApi.endpoints.checkLogin.matchRejected, (state, action) => {
            /*Thunk is rejected when a cache result is returned (due to dispatchConditionRejection: true)*/
            if (action.meta?.condition) return

            let payload = action.payload
            if (payload.type === NETWORK_ERROR.HTTP_ERROR && [401, 403].includes(payload.status))
                state.loginStatus.recaptchaKey = payload.data.recaptcha_key
        })
        .addMatcher(authApi.endpoints.login.matchFulfilled, handleLoginFulfilled)
        .addMatcher(authApi.endpoints.logout.matchFulfilled, () => {
            /*Not pure, but an exception here as I want to clear everything*/
            localStorage.clear()
            window.location.reload()
        })

})

export const {
    setNetworkError,
    clearNetworkError,
    setCurrentModule,
} = appSlice.actions

export const selectLoginStatus = state => state.app.loginStatus
export const selectNetworkError = state => state.app.networkError
export const selectCurrentModule = state => state.app.currentModule