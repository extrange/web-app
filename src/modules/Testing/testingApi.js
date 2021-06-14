import {baseApi} from "../../core/network/baseApi";
import {baseQuery} from "../../core/network/baseQuery";


export const testingApi = baseApi.injectEndpoints({
    endpoints: build => ({
        throwHttpError: build.mutation({
            query: status => ({
                url: 'test/',
                params: {status}
            })
        }),
        throwFetchError: build.mutation({
            queryFn: (arg, api, extraOptions) =>
                baseQuery({
                    baseUrl: 'https://dummy.nicholaslyz.com',
                    credentials: "include"
                })(arg, api, extraOptions)
        })
    })
})

export const {
    useThrowHttpErrorMutation,
    useThrowFetchErrorMutation
} = testingApi