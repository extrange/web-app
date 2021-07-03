import { stripHtml, stripUndefined } from "../../shared/util";
import { NETWORK_ERROR } from "../constants";
import { joinUrl } from "../../shared/util";
import { retry } from "@reduxjs/toolkit/dist/query";

const defaultValidateStatus = response =>
    (response.status >= 200 && response.status <= 299)


/*Parse body as JSON only if content-type is JSON*/
const responseHandler = response =>
    response.headers.get('content-type')?.trim()?.startsWith('application/json') ?
        response.json() :
        response.text()

/*Custom query which wraps fetch errors in NetworkError format.
* Will consider 4xx/5xx statuses to be errors, regardless of login status.*/
export const baseQuery = ({
    baseUrl,
    defaultHeaders = {},
    prepareHeaders = (x) => x,
    fetchFn = fetch,
    ...baseFetchOptions
}) =>
    async (arg = {}, { signal, getState }) => {
        let {
            url = '',
            method = 'GET',
            headers = new Headers({}),
            body = undefined,
            params = undefined,
            validateStatus = defaultValidateStatus,
        } = typeof arg == 'string' ? { url: arg } : arg
        let config = {
            ...baseFetchOptions,
            method,
            signal,
            body,
        }

        config.headers = await prepareHeaders(
            new Headers(stripUndefined({ ...defaultHeaders, ...headers })),
            { getState }
        )

        config.body = JSON.stringify(body)

        if (params) {
            const divider = ~url.indexOf('?') ? '&' : '?'
            const query = new URLSearchParams(stripUndefined(params))
            url += divider + query
        }

        url = joinUrl(baseUrl, url)


        const request = new Request(url, config)
        const requestClone = request.clone()

        try {
            const response = await fetchFn(request)
            const responseClone = response.clone()

            const meta = { request: requestClone, response: responseClone }

            const resultData = await responseHandler(response)

            return validateStatus(response, resultData)
                ? {
                    data: resultData, //This is not wrapped in 'data' in the reducer!
                    meta,
                }
                : {
                    error: {
                        method: request.method,
                        url: request.url,
                        text: typeof resultData === 'object' ? JSON.stringify(resultData, undefined, 2) : stripHtml(resultData),
                        status: response.status,
                        type: NETWORK_ERROR.HTTP_ERROR,

                        /*Mainly for use by auth*/
                        data: resultData
                    },
                    meta,
                }
        } catch (e) {
            return {
                error: {
                    method: request.method,
                    url: request.url,
                    text: `${e.name}: ${e.message}`,
                    type: NETWORK_ERROR.FETCH_ERROR
                }
            }
        }
    }

/* baseQuery with retries ONLY on NETWORK_ERROR.FETCH_ERROR (Up to 5, exponential backoff) */
export const baseQueryWithRetry = (...baseQueryOptions) =>
    retry(
        (...args) =>
            baseQuery(...baseQueryOptions)(...args)
                .then(r => r.error && r.error.type !== NETWORK_ERROR.FETCH_ERROR ? retry.fail(r.error) : r),
        { maxRetries: 5 }
    )