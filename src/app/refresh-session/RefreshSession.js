import {useCheckLoginQuery} from "../auth/authApi";

const SESSION_REFRESH_INTERVAL_MS = 60 * 60 * 1000;

export const RefreshSession = () => {
    useCheckLoginQuery(undefined, {
        pollingInterval: SESSION_REFRESH_INTERVAL_MS,
        refetchOnReconnect: true,
    })
    return null
}