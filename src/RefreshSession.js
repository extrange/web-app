import {useCallback, useEffect} from "react";
import {Networking, NotAuthenticated} from "./util/networking";
import {LOGIN_URL} from "./globals/urls";
import {useAsyncError} from "./util/useAsyncError";

const SESSION_REFRESH_INTERVAL_MS = 60 * 60 * 1000

/**
 * Refreshes session every {SESSION_REFRESH_INTERVAL_MS} while tab is open
 * @returns {*}
 * @constructor
 */
export const RefreshSession = ({setLoggedOutSb}) => {
    const setError = useAsyncError()

    const refresh = useCallback(() => Networking
        .send(LOGIN_URL, {method: 'GET'})
        .catch(e => {
            if (e instanceof NotAuthenticated) {
                setLoggedOutSb(true)
            } else setError(e.message)
        }), [setError, setLoggedOutSb])

    useEffect(() => {
        let intervalId = setInterval(refresh, SESSION_REFRESH_INTERVAL_MS)
        return () => clearInterval(intervalId)

    }, [refresh])

    return null
}