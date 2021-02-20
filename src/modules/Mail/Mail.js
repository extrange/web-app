import {debounce} from 'lodash'
import {useContext, useEffect} from "react";
import {getIhisMail, getMohhMail, HMAIL_URL} from "./urls";
import {useAsyncError} from "../../util/useAsyncError";
import {NotificationContext} from "../../shared/NotificationProvider/notificationContext";
import {NotAuthenticated} from "../../util/networking";

const [IHIS, MOHH] = ['IHIS', 'MOHH'];
const MAIL_UPDATE_FREQUENCY = 60 * 1000

export const Mail = () => {

    const setError = useAsyncError();
    const notificationParams = useContext(NotificationContext)

    const notifyMailDebounced = debounce(({addNotification, removeNotificationBySource}) => {

        const ihisPromise = getIhisMail().then(json => {
            removeNotificationBySource(IHIS);
            if (json.length > 0) {
                addNotification({
                    source: IHIS,
                    title: `Unread Mail (${json.length})`,
                    content: [json[0]['from'].join(', '), json[0]['preview']].join(' - '),
                    count: json.length,
                    action: () => window.open(HMAIL_URL, '_blank')
                })
            }
        })

        const mohhPromise = getMohhMail().then(json => {
            removeNotificationBySource(MOHH);
            if (json.length > 0) {
                addNotification({
                    source: 'MOHH',
                    title: `Unread Mail (${json.length})`,
                    content: [json[0]['from'].join(', '), json[0]['preview']].join(' - '),
                    count: json.length,
                    action: () => window.open(HMAIL_URL, '_blank')
                })
            }

        })

        return Promise.all([ihisPromise, mohhPromise])

    }, MAIL_UPDATE_FREQUENCY, {leading: true, trailing: true, maxWait: MAIL_UPDATE_FREQUENCY})

    useEffect(() => {
            const notifyMailDebouncedWithError = () =>
                notifyMailDebounced(notificationParams).catch(e => (e instanceof NotAuthenticated) ? console.log(e) : setError(e.message))

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

    return null
}