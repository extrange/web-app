import {getIhisMail, getMohhMail, HMAIL_URL} from "./urls";
import {throttle} from 'lodash'

export const CHECK_MAIL_FREQUENCY_MS = 30 * 1000;

const [IHIS, MOHH] = ['IHIS', 'MOHH'];

const checkMail = ({addNotification, removeNotificationBySource}) => Promise.all([
    getIhisMail().then(json => {
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
    }),

    getMohhMail().then(json => {
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
]);

/*Throttling reduces network calls when the user repeatedly switches tabs*/
export const checkMailThrottled = throttle(checkMail, CHECK_MAIL_FREQUENCY_MS, {trailing: false});
