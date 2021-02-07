/**
 * Utility Classes/Constants for all modules
 * */

import {useReducer} from 'react';
import removeAccents from "remove-accents"
import seedrandom from 'seedrandom'
import {differenceInCalendarDays} from "date-fns";

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
            return resp.json().then(json => {
                throw new BadRequest(`BadRequest: ${resp.status}:${resp.statusText}
            ${JSON.stringify(json, undefined, 2)}`)
            })
        } else if (399 < resp.status < 500) {
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

export const isEmpty = string => !Boolean(string?.trim());

/**
 * Returns a seeded random number between min (inclusive) and max (exclusive)
 * @param min
 * @param max
 * @param seed
 */
export const getRandomInt = (min, max, seed) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    let rng = seedrandom(seed);
    return Math.floor(rng() * (max - min) + min)
};

/**
 * Days since Unix Epoch
 * Works properly so far (i.e. day count changes at 0000hrs of current locale)
 * @returns {number}
 */
export const getDaysSinceEpoch = (date) => date
    ? differenceInCalendarDays(date, new Date(0))
    : differenceInCalendarDays(new Date(), new Date(0));

export const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export const noop = () => {
};