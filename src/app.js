import {NotificationContext} from './notificationContext'
import {useEffect, useRef, useState} from "react";
import {notifyMailDebounced} from "./mail/notifications";
import {useAsyncError} from "./components/useAsyncError";
import {noop, NotAuthenticated} from "./util";

// This class handles notifications which should run on startup (via useEffect), and also provides notificationContext
// Only executed after successful login
export const App = ({children}) => {

    const [notifications, setNotifications] = useState([])
    const nextId = useRef(0);
    const setError = useAsyncError()

    const addNotification = ({source, title, content, count = 1, action = noop()}) => {
        setNotifications(state => [...state, {
            id: nextId.current,
            source,
            title,
            content,
            count,
            timestamp: Date.now(),
            action,
        }])
        return nextId.current++;
    }

    const removeNotification = id => setNotifications(state => state.filter(e => e.id !== id))
    const removeNotificationBySource = source => setNotifications(state => state.filter(e => e.source !== source))

    const notificationParams = {
        nextId: nextId.current,
        notifications,
        addNotification,
        removeNotification,
        removeNotificationBySource
    }

    //todo figure out some general purpose notification API. This is really just for mail now.
    useEffect(() => {
            const notifyMailDebouncedWithError = () =>
                notifyMailDebounced(notificationParams).catch(e => (e instanceof NotAuthenticated) ? console.log(e): setError(e.message))

            // Run once on startup
            notifyMailDebouncedWithError()

            // Set event listener for window
            let intervalId;
            const onFocusListener = () => {
                notifyMailDebouncedWithError()
                intervalId = setInterval(() => notifyMailDebouncedWithError(), 30 * 1000)
            }

            // Don't actively check for mail when window is blurred
            const onBlurListener = () => {
                clearInterval(intervalId)
            }

            window.addEventListener('focus', onFocusListener)
            window.addEventListener('blur', onBlurListener)

            // Be nice and tidy on unmounting
            return () => window.removeEventListener('focus', onFocusListener)
        }

        // eslint-disable-next-line
        , [])

    return <NotificationContext.Provider value={notificationParams}>
        {children}
    </NotificationContext.Provider>
}