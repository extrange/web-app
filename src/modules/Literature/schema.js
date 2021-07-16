/**
 * Schemas for Yup validation, default field values, transformations before submission and other utility functions
 */

import * as yup from "yup";
import {formatISO, parseISO} from "date-fns";
import {trim, isNumber, isEqual, pick} from 'lodash'

/*
This is the schema AFTER hydrating to user-viewable input (id, date_added etc are stripped).

Schema keys here are equal to those server-side
*/
const BOOK_SCHEMA = {
    authors: {
        yupSchema: yup.array(
            yup.object({
                name: yup.string(),
                id: yup.number().required(),
                notes: yup.string()
            }))
            .ensure(),
        defaultValue: [],
        transformToServer: val => val.map(e => e.id),
        transformFromServer: (val, {authors}) => val.map(id => id._name ? id : authors.find(e => e.id === id))
    },
    genres: {
        yupSchema: yup.array(
            yup.object({
                name: yup.string(),
                id: yup.number().required(),
                notes: yup.string()
            }))
            .ensure(),
        defaultValue: [],
        transformToServer: val => val.map(e => e.id),
        transformFromServer: (val, {genres}) => val.map(id => genres.find(e => e.id === id))
    },
    type: {
        yupSchema: yup.object({
            name: yup.string(),
            id: yup.number().required(),
            notes: yup.string()
        }).typeError('Required'),
        defaultValue: null,
        transformToServer: val => val.id,
        transformFromServer: (val, {types}) => types.find(e => e.id === val)
    },
    title: {
        yupSchema: yup.string().required(),
        defaultValue: '',
    },
    description: {
        yupSchema: yup.string(),
        defaultValue: '',
    },
    read_next: {
        yupSchema: yup.bool(),
        defaultValue: false,
    },
    date_read: {
        /*v3 KeyboardDatePicker will return 'Invalid Date' as a string for invalid input, causing typeError
        * Apparently will return null if left blank
        * This value is modified on submission, to ISO8601
        * Necessary to check if validated date is not null prior to modifying to ISO8601*/
        yupSchema: yup.date().nullable().typeError('Date must be in dd/mm/yyyy format'),
        defaultValue: null,
        transformToServer: val => val ? formatISO(val, {representation: "date"}) : null,
        transformFromServer: val => val ? parseISO(val) : null // date could be null
    },
    image_url: {
        yupSchema: yup.string().url(),
        defaultValue: '',
    },
    published: {
        yupSchema: yup.number().integer().nullable().transform((val, origVal) => trim(origVal) === '' ? null : val)
            .typeError('Must be a valid year'),
        defaultValue: '',
        /* isNumber checks are needed because 0 is falsy*/
        transformFromServer: val => isNumber(val) ? val : ''
    },
    google_id: {
        yupSchema: yup.string(),
        defaultValue: '',
        transformToServer: val => trim(val) || null,
        transformFromServer: val => val || '',
    },
    goodreads_book_id: {
        yupSchema: yup.string(),
        defaultValue: '',
        transformToServer: val => trim(val) || null,
        transformFromServer: val => val || ''
    },
    series: {
        yupSchema: yup.string(),
        defaultValue: '',
    },
    series_position: {
        yupSchema: yup.string(),
        defaultValue: '',
    },
    rating: {
        yupSchema: yup.number().min(0).max(5).nullable().transform((val, origVal) => trim(origVal) === '' ? null : val),
        defaultValue: '',
        /* isNumber checks are needed because 0 is falsy*/
        transformToServer: val => isNumber(val) ? Math.round(val * 10) / 10 : null, //val is guaranteed to be either number or null here
        transformFromServer: val => isNumber(val) ? val : ''
    },
    my_review: {
        yupSchema: yup.string(),
        defaultValue: '',
    },
    notes: {
        yupSchema: yup.string(),
        defaultValue: '',
    },
};

export const BOOK_FIELDS = Object.fromEntries(Object.keys(BOOK_SCHEMA).map(e => [e, e]));

export const YUP_SCHEMA = yup.object(Object.fromEntries(Object.entries(BOOK_SCHEMA)
    .map(([k, v]) => [k, v.yupSchema]))).noUnknown();

export const DEFAULT_BOOK_VALUES = Object.fromEntries(Object.entries(BOOK_SCHEMA)
    .map(([k, v]) => [k, v.defaultValue]));

export const transformToServer = data => Object.fromEntries(
    Object.entries(data)
        .map(([k, v]) =>
            /*This is NOT the same as
            * BOOK_SCHEMA[k].transformToServer?.(v) ?? v
            *
            * The above code will return v if transformToServer(v) === null, which is not intended behavior
            * */
            [k, BOOK_SCHEMA[k].transformToServer ?
                BOOK_SCHEMA[k].transformToServer(v) :
                v]
        ));

export const transformFromServer = (data, dataTypes) => Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
        /*See above for explanation why nullish coalescing/optional chaining is not used here*/
        k, BOOK_SCHEMA[k]?.transformFromServer ?
            BOOK_SCHEMA[k].transformFromServer(v, dataTypes) :
            v])
);

/**
 * Verify if user had made changes to the fields
 * @param originalData - from server
 * @param userData - data from UI after transformation
 * @returns {boolean}
 */
export const isBookDataEqual = (originalData, userData) =>
    isEqual(pick(originalData, Object.keys(BOOK_FIELDS)), userData);