import {getIhisMail, getMohhMail} from "./urls";
import {debounce} from 'lodash'

const IHIS = 'IHIS';
const MOHH = 'MOHH';
const MAIL_UPDATE_FREQUENCY = 60 * 1000

export const notifyMailDebounced = debounce(({addNotification, removeNotificationBySource}) => {

    getIhisMail().then(json => {
        removeNotificationBySource(IHIS);
        if (json.length > 0) {
            addNotification({
                source: IHIS,
                title: `Unread Mail (${json.length})`,
                content: [json[0]['from'].join(', '), json[0]['preview']].join(' - '),
                count: json.length,
            })
        }
    })

    getMohhMail().then(json => {
        removeNotificationBySource(MOHH);
        if (json.length > 0) {
            addNotification({
                source: 'MOHH',
                title: `Unread Mail (${json.length})`,
                content: [json[0]['from'].join(', '), json[0]['preview']].join(' - '),
                count: json.length,
            })
        }

    })

}, MAIL_UPDATE_FREQUENCY, {leading: true, trailing: true, maxWait: MAIL_UPDATE_FREQUENCY})