import {getIhisMail, getMohhMail, HMAIL_URL} from "./urls";

const [IHIS, MOHH] = ['IHIS', 'MOHH'];

/*No need to debounce this, since server-side already caches responses for 60s*/
export const checkMail = ({addNotification, removeNotificationBySource}) =>
{console.log(`Check mail @ ${new Date()}`)
    return Promise.all([
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
    ])
}