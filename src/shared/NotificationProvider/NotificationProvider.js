import {NotificationContext} from './notificationContext'
import {useRef, useState} from "react";
import {noop} from "../../util/util";
import {Mail} from '../../modules/Mail/Mail'

/*
This class handles notifications and also provides notificationContext.
Only executed after successful login.
*/
export const NotificationProvider = ({children}) => {

    const [notifications, setNotifications] = useState([]);
    const nextId = useRef(0);

    const addNotification = ({source, title, content, count = 1, action = noop()}) => {
        setNotifications(state => [...state, {
            id: nextId.current,
            source,
            title,
            content,
            count,
            timestamp: Date.now(),
            action,
        }]);
        return nextId.current++;
    };

    const removeNotification = id => setNotifications(state => state.filter(e => e.id !== id));
    const removeNotificationBySource = source => setNotifications(state => state.filter(e => e.source !== source));

    const notificationParams = {
        nextId: nextId.current,
        notifications,
        addNotification,
        removeNotification,
        removeNotificationBySource
    };

    return <NotificationContext.Provider value={notificationParams}>
        <Mail/>
        {children}
    </NotificationContext.Provider>
};