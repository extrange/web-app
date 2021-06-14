import {createSlice, isAllOf, isRejectedWithValue} from "@reduxjs/toolkit";
import {NETWORK_ERROR, NETWORK_METHOD} from "./constants";
import {authApi} from "../core/auth/authApi";

const name = 'app'

/*For localStorage*/
const CURRENT_MODULE = 'CURRENT_MODULE';

const initialState = {
    /*Access rights, sub-module state etc*/
    module: {
        id: localStorage.getItem(CURRENT_MODULE) || '',
        title: '',
        meta: {}
    },

    /*Cosmetic*/
    appBar: {
        drawerOpen: false,
    },

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

const setNetworkErrorReducer = (state, action) => {

    let payload = action.payload
    let {
        method = 'Method not specified',
        url = 'URL not specified',
        text = '',
        status = null, /*Must be specified if HTTP_ERROR*/
        type
    } = payload

    /*Type not specified:  rejected thunk with value which is NOT a NetworkError object*/
    if (!type) {
        state.networkError = {
            method,
            url,
            text: JSON.stringify(action, undefined, 2),
            status,
            type
        }
        return
    }

    if (type === NETWORK_ERROR.HTTP_ERROR && typeof status !== 'number')
        throw new Error(`NetworkError: 'status' must be a number if 
            'type' === HTTP_ERROR, but got ${status} instead`)

    /*Ignore 401/403 errors if not logged in*/
    if (!state.loginStatus.loggedIn &&
        [401, 403].includes(status)) {
        return
    }
    state.networkError = {method, url, text, status, type}
}

export const appSlice = createSlice({
    name,
    initialState,
    reducers: {
        setNetworkError: setNetworkErrorReducer,
        clearNetworkError: state => void (state.networkError = null),
        setCurrentModule: {
            reducer: (state, {payload: {id, meta, title}}) => void (state.module = {id, meta, title}),
            prepare: ({id, ...args} = {}) => {
                localStorage.setItem(CURRENT_MODULE, id)
                return {payload: {id, ...args}}
            }
        },
        setAppBar: (state, {payload: {drawerOpen = false}}) => void (state.appBar.drawerOpen = drawerOpen)
    },
    extraReducers: builder => builder
        .addMatcher(authApi.endpoints.checkLogin.matchFulfilled, handleLoginFulfilled)
        .addMatcher(isAllOf(authApi.endpoints.checkLogin.matchRejected, isRejectedWithValue),
            (state, action) => {
                let payload = action.payload
                if (payload.type === NETWORK_ERROR.HTTP_ERROR && [401, 403].includes(payload.status))
                    state.loginStatus.recaptchaKey = payload.data.recaptcha_key
            })
        .addMatcher(authApi.endpoints.login.matchFulfilled, handleLoginFulfilled)
        .addMatcher(authApi.endpoints.logout.matchFulfilled, () => {
            /*Not pure, but an exception here as I want to clear everything*/
            localStorage.clear()
            /*Page is refreshed on logout, to clear both Redux store and cached memory.*/
            window.location.reload()
        })

})

export const {
    setNetworkError,
    clearNetworkError,
    setCurrentModule,
    setAppBar,
} = appSlice.actions

export const selectLoginStatus = state => state[name].loginStatus
export const selectNetworkError = state => state[name].networkError
export const selectCurrentModule = state => state[name].module
export const selectCurrentModuleTitle = state => state[name].module.title
export const selectAppBarDrawerOpen = state => state[name].appBar.drawerOpen