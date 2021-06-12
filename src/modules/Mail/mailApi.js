import {baseApi} from "../../app/baseApi";


export const mailApi = baseApi.injectEndpoints({
    endpoints: build => ({
        checkIhisMail: build.query({
            query: () => 'hmail/check-ihis-mail/'
        }),
        checkMohhMail: build.query({
            query: () => 'hmail/check-mohh-mail/'
        })
    })
})

export const {
    useCheckIhisMailQuery,
    useCheckMohhMailQuery,
} = mailApi