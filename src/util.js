/**
 * Utility Classes/Constants for all modules
 * */

import {useReducer} from 'react';
import removeAccents from "remove-accents"

export class NotAuthenticated {
    constructor(message) {
        this.message = message;
    }
}

export class ServerError {
    constructor(message) {
        this.message = message;
    }
}

/**
 * Returned when invalid/missing values are given for fields
 */
export class BadRequest extends Error{
    constructor(message, payload) {
        super(message);
        this.payload = payload;
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
     * Wrap fetch request with authentication headers and todo manage reauth automatically
     * Throws errors if response status code is not between 200-299.
     * @param url
     * @param obj Parameters for the fetch() request. Must include 'method'.
     * @returns {Promise<Response>}
     */
    static send = async (url, {method, headers, body = null,}) => {
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
            throw new BadRequest(`Bad request: ${resp.status}:${resp.statusText}`, resp.body)
        } else if (399 < resp.status < 500) {
            throw new NotAuthenticated(`Unauthenticated: ${resp.status}:${resp.statusText}`)
            //todo reauth
        } else throw new ServerError(`Status ${resp.status}:${resp.statusText}`)

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

/**
 * Uses useReducer (setValue is dispatch({name, value})
 * value can be a function, which will receive the latest state[key] as an argument.
 * If initial state for a key is not set, returns '' by default.
 * @param initialValues initial value of inputs as an object of name: value pairs
 * @returns {{bind: (function(*=): {onChange: function(*): *, name: *, value}), onChange: (function(*): *), setValues: *, values: React.ReducerStateWithoutAction<function(*=, *): (*)>}}
 */
export const useInput = (initialValues = {}) => {
    const reducer = (state, action) => {
        if (typeof action.value === 'function') {
            return {
                ...state,
                [action.name]: action.value(state[action.name])
            }
        } else
            return {
                ...state,
                [action.name]: action.value
            };
    };

    const [values, setValue] = useReducer(reducer, initialValues);

    const onChange = e => setValue({
        name: e.target.name,
        value: e.target.value
    });

    const bind = name => ({
        onChange,
        name: name,
        value: values[name] || ''
    });

    return {values, setValue, onChange, bind}

};

/**
 * Strip accents, empty spaces and lowercase a string (for comparison purposes)
 * undefined/null returns an empty string
 * @param {String} string
 */
export const sanitizeString = string =>
    string ? removeAccents(string).trim().toLowerCase() : ''
;

export const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;