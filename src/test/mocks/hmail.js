import {rest} from 'msw'
import { API_URL } from '../../app/urls'
import { fakeIhisMail, fakeMohhMail } from './fakeHmailData'

export const hmail = [
    rest.get(API_URL + '/hmail/check-ihis-mail/', (req, res, ctx)=> {
        return res(
            ctx.status(200),
            ctx.json(fakeIhisMail)
        )
    }),
    rest.get(API_URL + '/hmail/check-mohh-mail/', (req, res, ctx)=> {
        return res(
            ctx.status(200),
            ctx.json(fakeMohhMail)
        )
    })
]