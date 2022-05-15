/**
 * Base createApi.
 */

import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { retry } from "@reduxjs/toolkit/dist/query";
import { fetchWithError } from "../network-error/fetchWithError";

/* Connect to an alternative backend if supplied via
a '#' fragment */
const API_URL = window.location.hash.slice(1) || "https://api.nicholaslyz.com";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: retry(async (...args) => {
    const result = await fetchBaseQuery({
      baseUrl: API_URL,
      credentials: "include",
      fetchFn: fetchWithError
    }).apply(null, args);
    // Do not retry on non-fetch errors
    // Note: 'typeof === "number"' is used since there are some errors
    // without bodies e.g. `condition === true`
    if (typeof result.error?.status === "number") {
      retry.fail(result.error);
    }
    return result;
  }),
  endpoints: () => ({}),
});
