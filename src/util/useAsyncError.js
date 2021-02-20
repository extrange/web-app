import {useState} from 'react'

/*Workaround to throw errors in callbacks to ErrorBoundaries*/
export const useAsyncError = () => {
    const setError = useState(null)[1];

    return e => setError(() => {
        throw new Error(e)
    })
};