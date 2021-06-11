/**
 * Base createApi.
 */

import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {baseQuery} from "./baseQuery";

const API_URL = 'https://api.nicholaslyz.com'

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQuery({
        baseUrl: API_URL,
        credentials: "include"
    }),
    endpoints: () => ({})
})