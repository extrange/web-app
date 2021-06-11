import {isRejectedWithValue} from "@reduxjs/toolkit";
import {setNetworkError} from "./appSlice";

/*Show network errors for rejected thunk actions*/
export const networkErrorMiddleware = ({dispatch}) => next => action => {


    if (isRejectedWithValue(action)) {
        /*Payload has been formatted by baseQuery.
        * Reducer will filter out 401/403s while not logged in*/
        dispatch(setNetworkError(action.payload))
    }
    return next(action)
}