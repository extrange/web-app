import {addNotifications, removeNotificationsFromSource} from "../../app/notifications/notificationSlice";
import {format, isToday, parseJSON} from "date-fns";

export const handleMailAction = (data, source) => dispatch => {
    dispatch(removeNotificationsFromSource(source))
    dispatch(addNotifications(data.map(e => {
        let date = parseJSON(e.date)
        return ({
            title: e.title,
            content: `${format(date, isToday(date) ? 'p' : 'd/M')} ` + [e.from.join(', '), e.preview].join(' - '),
            source,
            timestamp: date.getTime()
        })
    })))
}