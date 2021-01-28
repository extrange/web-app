import {NotificationContext} from './notificationContext'
import {useEffect, useRef, useState} from "react";
import {notifyMailDebounced} from "./mail/notifications";


// Only executed after successful login
export const App = ({children}) => {

    const [notifications, setNotifications] = useState([])
    const nextId = useRef(0);

    const addNotification = ({
                                 source, title, content, count = 1, action = () => {
        }
                             }) => {
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


    useEffect(() => {
            [notifyMailDebounced].forEach(e => e.call(null, notificationParams))

            // Set event listener for window
            let intervalId;
            const onFocusListener = () => {
                notifyMailDebounced(notificationParams)
                intervalId = setInterval(() => notifyMailDebounced(notificationParams), 30 * 1000)
            }

            // Don't actively check for mail when window is blurred
            const onBlurListener = () => {
                clearInterval(intervalId)
            }

            window.addEventListener('focus', onFocusListener)
            window.addEventListener('blur', onBlurListener)


            return () => window.removeEventListener('focus', onFocusListener)
        }

        // eslint-disable-next-line
        , [])

    return <NotificationContext.Provider value={notificationParams}>
        {children}
    </NotificationContext.Provider>
}