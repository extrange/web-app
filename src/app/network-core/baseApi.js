/**
 * Base createApi.
 */

import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithRetry } from "./baseQuery";

const API_URL = 'https://api.nicholaslyz.com'

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithRetry({
        baseUrl: API_URL,
        credentials: "include",
        defaultHeaders: { 'content-type': 'application/json' }
    }),
    endpoints: () => ({}),
})