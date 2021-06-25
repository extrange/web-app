import {stripHtml, stripUndefined} from "../../shared/util";
import {NETWORK_ERROR} from "../constants";

const defaultValidateStatus = response =>
    (response.status >= 200 && response.status <= 299)


/*Parse body as JSON only if content-type is JSON*/
const responseHandler = response =>
    response.headers.get('content-type')?.trim()?.startsWith('application/json') ?
        response.json() :
        response.text()

/*Joins 2 URLs. Will not modify trailing slashes if present*/
const joinUrl = (base, url) => {
    if (!base) {
        return url
    }
    if (!url) {
        return base
    }
    return base.replace(/\/$/, '') + '/' + url.replace(/^\//)
}

/*Custom query which wraps fetch errors in NetworkError format.
* Will consider 4xx/5xx statuses to be errors, regardless of login status.*/
export const baseQuery = ({
                              baseUrl,
                              defaultHeaders = {},
                              prepareHeaders = (x) => x,
                              fetchFn = fetch,
                              ...baseFetchOptions
                          }) =>
    async (arg = {}, {signal, getState}) => {
        let {
            url = '',
            method = 'GET',
            headers = new Headers({}),
            body = undefined,
            params = undefined,
            validateStatus = defaultValidateStatus,
        } = typeof arg == 'string' ? {url: arg} : arg
        let config = {
            ...baseFetchOptions,
            method,
            signal,
            body,
        }

        config.headers = await prepareHeaders(
            new Headers(stripUndefined({...defaultHeaders, ...headers})),
            {getState}
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

            const meta = {request: requestClone, response: responseClone}

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