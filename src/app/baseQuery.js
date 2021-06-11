import {joinUrl, stripUndefined} from "../shared/util";
import {NETWORK_ERROR} from "./constants";

const defaultValidateStatus = response =>
    (response.status >= 200 && response.status <= 299)


/*Parse body as JSON only if content-type is JSON*/
const responseHandler = response =>
    response.headers.get('content-type')?.trim()?.startsWith('application/json') ?
        response.json() :
        response.text()

/*Custom query which wraps fetch errors in NetworkError format, instead of throwing.*/
export const baseQuery = ({
                              baseUrl,
                              prepareHeaders = (x) => x,
                              fetchFn = fetch,
                              ...baseFetchOptions
                          }) =>
    async (arg, {signal, getState}) => {
        let {
            url,
            method = 'GET',
            headers = new Headers({}),
            body = undefined,
            params = undefined,
            validateStatus = defaultValidateStatus,
            ...rest
        } = typeof arg == 'string' ? {url: arg} : arg
        let config = {
            ...baseFetchOptions,
            method,
            signal,
            body,
            ...rest,
        }

        config.headers = await prepareHeaders(
            new Headers(stripUndefined(headers)),
            {getState}
        )

        config.headers.set('content-type', 'application/json')
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
                        text: resultData,
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