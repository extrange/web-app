import {baseApi} from "../../app/network-core/baseApi";

export const hmailApi = baseApi.injectEndpoints({
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
} = hmailApi