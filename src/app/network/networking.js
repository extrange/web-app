import {setNetworkError} from "../appSlice";
import store from '../store'
import {NETWORK_ERROR} from "./NetworkError";

/**
 * Handles authentication for fetch() requests.
 * Static class
 */
export class Networking {

    static GET = 'GET';
    static POST = 'POST';
    static DELETE = 'DELETE';
    static PUT = 'PUT';

    /**
     * Wrap fetch request with authentication headers.
     * Throws on fetch/4xx/5xx errors (promise is NOT resolved)
     * User will be notified via snackbar.
     *
     * Sample usage:
     * ```
     * Networking.send(LOGIN_URL, {method: Networking.POST, body: {...}})
     * .then(resp => //code to deal with response)
     * ```
     *
     * @param url
     * @param obj Parameters for the fetch() request. Defaults to 'GET'.
     * if 'allowUnauth' is true, will not throw on 401/403 errors.
     * @returns {Promise<Response>}
     */
    static send = (url, {method = Networking.GET, headers, body = null, allowUnauth = false} = {}) =>
        new Promise(resolve =>
            fetch(url, {
                    method: method,
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        ...headers
                    },
                    body: body
                }
            ).then(resp => resp.ok || ([401, 403].includes(resp.status) && allowUnauth) ?
                void resolve(resp) :
                resp.text()
                    .then(r =>
                        void store.dispatch(setNetworkError({
                                message: {method, url, text: r},
                                name: `HTTP Error ${resp.status}: ${resp.statusText}`,
                                type: NETWORK_ERROR.HTTP_ERROR,
                                status: resp.status
                            })
                        )
                    )
            ).catch(e => void store.dispatch(setNetworkError({
                message: {method, url, text: e.message},
                name: e.name,
                type: NETWORK_ERROR.FETCH_ERROR,
            })))
        );


    /**
     * Convenience methods for obtaining get, add, update and delete methods from a URL
     *
     * <pre>
     * get: function(...params) => url(...params)
     * add: function(object, ...params) => url(...params)
     * update: function (object, id, ...params) => detailUrl(id, ...params)
     * del: function (id, ...params) => detailUrl(id, ...params)
     * </pre>
     *
     * @param url str or function(...params) => url to obtain object list
     * @param detailUrl function(id, ...params) => url to obtain object details
     * @returns {[function(): Promise<unknown>, function(*=): Promise<unknown>, function(*=): Promise<unknown>, function(*=): Promise<unknown>]}
     */
    static crudMethods = (url, detailUrl) => {
        let get = (...params) => Networking.send(
            typeof url === 'function' ?
                url(...params) :
                url,
            {method: Networking.GET})
            .then(resp => resp.json());

        let add = (object, ...params) => Networking.send(
            typeof url === 'function' ?
                url(...params) :
                url,
            {
                method: Networking.POST,
                body: JSON.stringify(object),
            })
            .then(resp => resp.json());

        let update = (object, id, ...params) => Networking.send(
            detailUrl(id, ...params),
            {
                method: Networking.PUT,
                body: JSON.stringify(object),
            })
            .then(resp => resp.json());

        let del = (id, ...params) => Networking.send(
            detailUrl(id, ...params),
            {method: Networking.DELETE}); //Note - for a DELETE operation, nothing is returned by the server

        return [get, add, update, del]
    }
}