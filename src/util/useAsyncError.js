import {useState} from 'react'
import {useCallback} from "react";

/*Workaround to throw errors in callbacks to ErrorBoundaries*/
export const useAsyncError = () => {
    const setError = useState(null)[1];

    return useCallback(e => setError(() => {
        if (e instanceof Error){
            throw e
        } else {
            throw new Error(e)
        }

    }), [setError])
};