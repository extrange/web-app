/**
 * Utility functions.
 * Larger functions should be in their own file.
 */
import removeAccents from "remove-accents"
import seedrandom from 'seedrandom'
import {
    differenceInCalendarDays,
    differenceInCalendarYears,
    differenceInMinutes,
    format,
    formatDistanceToNow,
    formatDistanceToNowStrict
} from "date-fns";
import UAParser from "ua-parser-js";
import {isPlainObject} from "@reduxjs/toolkit";

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
export const getDaysSinceEpoch = () =>
    differenceInCalendarDays(new Date(), new Date(0));

/**
 * Returns formatDateToNow if within the same minute,
 * otherwise returns formatDistanceToNowStrict if within same calendar day,
 * otherwise returns date like 18 Apr if same calendar year,
 * otherwise like Apr 2021
 * @param date
 */
export const formatDistanceToNowPretty = date => {
    if (differenceInMinutes(new Date(), date) < 1)
        return formatDistanceToNow(date, {addSuffix: true});
    if (differenceInCalendarDays(new Date(), date) < 1)
        return formatDistanceToNowStrict(date, {addSuffix: true});
    if (differenceInCalendarYears(new Date(), date) < 1)
        return format(date, 'd MMM');
    return format(date, 'MMM y')
};

export const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export const noop = () => {
};

/**
 * Cryptographically secure random number generator.
 * Assumes window.crypto exists.
 */
export const getSecureRandom = () => {
    if (!window.crypto) throw new Error('window.crypto not supported on browser');

    let arr = new Uint32Array(1);
    const max = 2 ** 32;

    /*Will generate random numbers between 0 and 1 (exclusive) with 32 bit maximum precision
    * Rejection sampling.*/
    const random = () => {
        let val = crypto.getRandomValues(arr)[0] / max;
        if (val >= 1) return random();
        return val
    };

    /*Random integer between min (inclusive) and max (exclusive)*/
    const randint = (min, max) => {
        let floor_min = Math.floor(min);
        let floor_max = Math.floor(max);
        return Math.floor(random() * (floor_max - floor_min)) + floor_min
    };

    /*Select random element of an array*/
    const choice = arr => arr[randint(0, arr.length)];

    return {
        random,
        randint,
        choice,
    }
};

export const prettifyUAString = uaString => {
    let ua = UAParser(uaString);
    let {
        browser: {
            name: browserName,
        },
        // if type is set, it is mobile
        device: {model, type},
        os: {name: osName, version: osVersion}
    } = ua;

    return {
        name: `${browserName} on ${osName} ${osVersion}${model ? ` (${model})` : ''}`,
        isMobile: Boolean(type),
        browserName
    }
};

export const stripHtml = html => {
   let doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
}

/*Copied from RTKQ's fetchBaseQuery.
* Will not affect non-objects such as classes.*/
export const stripUndefined = obj => {
    if (!isPlainObject(obj)) {
        return obj
    }
    const copy = {...obj}
    for (const [k, v] of Object.entries(copy)) {
        if (typeof v === 'undefined') delete copy[k]
    }
    return copy
}