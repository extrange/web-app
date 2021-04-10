import {NetworkState} from "../NetworkStateSnackbar";


export class NotAuthenticated extends Error {
    constructor(message, data) {
        super(message);
        this.data = data
    }
}

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
     * By default, notifies user and silences 4xx/5xx errors (promise is NOT resolved)
     *
     * Sample usage:
     * ```
     * Networking.send(LOGIN_URL, {method: Networking.POST, body: {...}})
     * .then(resp => //code to deal with response)
     * ```
     *
     * @param url
     * @param obj Parameters for the fetch() request. Defaults to 'GET'.
     * @returns {Promise<Response>}
     */
    static send = (url, {method = Networking.GET, headers, body = null} = {}) =>
        new Promise((resolve, reject) => {
            fetch(url, {
                    method: method,
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        ...headers
                    },
                    body: body
                }
            ).then(resp => {
                if (resp.ok) {
                    resolve(resp)
                } else {
                    NetworkState.httpError(resp)
                }
            }).catch(NetworkState.fetchError)
        })


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
                headers: {'Content-Type': 'application/json',}
            })
            .then(resp => resp.json());

        let update = (object, id, ...params) => Networking.send(
            detailUrl(id, ...params),
            {
                method: Networking.PUT,
                body: JSON.stringify(object),
                headers: {'Content-Type': 'application/json',}
            })
            .then(resp => resp.json());

        let del = (id, ...params) => Networking.send(
            detailUrl(id, ...params),
            {method: Networking.DELETE}); //Note - for a DELETE operation, nothing is returned by the server

        return [get, add, update, del]
    }
}