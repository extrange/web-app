/**
 * Base createApi.
 */

import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithRetry } from "./baseQuery";

/* Connect to an alternative backend if supplied via
a '#' fragment */
const API_URL = window.location.hash.slice(1) || "https://api.nicholaslyz.com";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry({
    baseUrl: API_URL,
    credentials: "include",
    defaultHeaders: { "content-type": "application/json" },
  }),
  endpoints: () => ({}),
});
