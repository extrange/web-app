import {isRejected, isRejectedWithValue} from "@reduxjs/toolkit";
import {setNetworkError} from "../../app/appSlice";

/*Show network errors for rejected thunk actions*/
export const networkErrorMiddleware = ({dispatch}) => next => action => {

    if (isRejectedWithValue(action)) {
        /*Payload has been formatted by baseQuery.
        * Reducer will filter out 401/403s while not logged in*/
        dispatch(setNetworkError(action.payload));

    } else if (isRejected(action) && !action.meta.condition) {
        /*Ignore thunks cancelled due to condition being true*/
        console.warn(`Rejected thunk:`, action)
    }

    return next(action)
}