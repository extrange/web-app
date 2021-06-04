import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Networking} from "./network/networking";
import {LOGIN_URL, LOGOUT_URL} from "./urls";

/*LocalStorage keys*/
const CURRENT_MODULE = 'CURRENT_MODULE';

const initialState = {
    currentModule: localStorage.getItem(CURRENT_MODULE),
    loginStatus: {
        user: null,
        loggedIn: false,
        isSuperUser: false,
    },
    networkError: null,

}

export const checkIfLoggedIn = createAsyncThunk('app/checkIfLoggedIn',
    (arg, {rejectWithValue}) =>
        Networking
            .send(LOGIN_URL, {allowUnauth: true})
            .then(r => r.ok ? r.json() : rejectWithValue()))

export const logout = createAsyncThunk('app/logout', () => {
    localStorage.clear(); // Clear localStorage if called
    return Networking.send(LOGOUT_URL, {method: 'POST'})
})

const loginStatusReducer = (state, {payload: {user, is_superuser}}) =>
    void (state.loginStatus = {
        user,
        loggedIn: true,
        isSuperUser: is_superuser
    })

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        login: loginStatusReducer,
        setNetworkError: (state, {payload}) => void (state.networkError = payload),
        clearNetworkError: state => void (state.networkError = null),
        setCurrentModule: (state, {payload}) => {
            localStorage.setItem(CURRENT_MODULE, payload)
            state.currentModule = payload
        }
    },
    extraReducers: builder => builder
        .addCase(checkIfLoggedIn.fulfilled, loginStatusReducer)
        .addCase(logout.fulfilled, () => initialState)
})

export const {
    login,
    setNetworkError,
    clearNetworkError,
    setCurrentModule
} = appSlice.actions
export const selectLoginStatus = state => state.app.loginStatus
export const selectNetworkError = state => state.app.networkError
export const selectCurrentModule = state => state.app.currentModule
export default appSlice.reducer