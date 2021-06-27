import { isAnyOf, isFulfilled, isPending, isRejected, isRejectedWithValue } from "@reduxjs/toolkit"
import { addNetworkAction, removeNetworkAction } from "../appSlice"


export const networkLoadingMiddleware = ({dispatch}) => next => action => {

    if (isPending(action)) {
        dispatch(addNetworkAction(action.meta.requestId))

    } else if (isAnyOf(isFulfilled, isRejected, isRejectedWithValue)(action)) {
        dispatch(removeNetworkAction(action.meta.requestId))
    }

    return next(action)
}