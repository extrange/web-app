export class NotAuthenticated extends Error {
}

export class ServerError extends Error {
}

/**
 * Returned when invalid/missing values are given for fields
 */
export class BadRequest extends Error {
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
     * Wrap fetch request with authentication headers and todo manage reauth automatically
     * Throws errors if response status code is not between 200-299.
     * @param url
     * @param obj Parameters for the fetch() request. Defaults to 'GET'.
     * @returns {Promise<Response>}
     */
    static send = async (url, {method=Networking.GET, headers, body = null,}) => {
        let resp = await fetch(url, {
                method: method,
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    ...headers
                },
                body: body
            }
        );

        if (resp.ok) {
            return resp
        } else if (resp.status === 400) {
            return resp.json().then(json => {
                throw new BadRequest(`BadRequest: ${resp.status}:${resp.statusText}
            ${JSON.stringify(json, undefined, 2)}`)
            })
        } else if (resp.status === 401 || resp.status === 403) {
            throw new NotAuthenticated(`NotAuthenticated: ${resp.status}:${resp.statusText}`)
            //todo reauth
        } else throw new ServerError(`ServerError: ${resp.status}:${resp.statusText}`)

    };

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