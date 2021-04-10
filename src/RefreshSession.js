import {useEffect} from "react";
import {Networking} from "./util/networking";
import {LOGIN_URL} from "./globals/urls";

const SESSION_REFRESH_INTERVAL_MS = 60 * 60 * 1000

/**
 * Refreshes session every {SESSION_REFRESH_INTERVAL_MS} while tab is open
 * @returns {*}
 * @constructor
 */
export const RefreshSession = () => {

    useEffect(() => {
        let intervalId = setInterval(
            () => Networking.send(LOGIN_URL, {method: 'GET'}),
            SESSION_REFRESH_INTERVAL_MS)
        return () => clearInterval(intervalId)
    }, [])

    return null
}