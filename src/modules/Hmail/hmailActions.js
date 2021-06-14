import {addNotifications, removeNotificationsFromSource} from "../../app/notifications/notificationSlice";
import {parseJSON} from "date-fns";
import {formatDistanceToNowPretty} from "../../shared/util";

export const handleMailAction = (data, source) => dispatch => {
    dispatch(removeNotificationsFromSource(source))
    dispatch(addNotifications(data.map(e => {
        let date = parseJSON(e.date)
        return ({
            title: e.title,
            content: `(${formatDistanceToNowPretty(date)}) ` + [e.from.join(', '), e.preview].join(' - '),
            source,
            sortTimestamp: date.getTime()
        })
    })))
}