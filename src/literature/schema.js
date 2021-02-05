/**
 * Schemas for Yup validation, default field values, transformations before submission and other utility functions
 */

import * as yup from "yup";
import {formatISO} from "date-fns";
import {cloneDeep, isEqual, omit, trim} from 'lodash'

/*
Coerce empty strings to null if value was an empty string prior to transformation/coercion, else return result after base coercion
Note that yup attempts to coerce values into the base type (string/array/integer) prior to transforms
*/
const emptyStringToNull = (val, origVal) => typeof origVal === 'string' && origVal === '' ? null : val;

/*
Coercions happen BEFORE transformations,
Transformations happen BEFORE validation
*/
const BOOK_SCHEMA = {
    authors: {
        yupSchema: yup.array(yup.number()).ensure().transform(val => val.map(e => e.id)),
        defaultValue: [],
    },
    genres: {
        yupSchema: yup.array(yup.number()).transform(val => val.map(e => e.id)),
        defaultValue: [],
    },
    type: {
        yupSchema: yup.mixed().transform(val => val?.id).required(),
        defaultValue: null,
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
        transformBeforeSubmit: val => val ? formatISO(val, {representation: "date"}) : null
    },
    image_url: {
        yupSchema: yup.string().url(),
        defaultValue: '',
    },
    published: {
        yupSchema: yup.number().integer().nullable().transform(emptyStringToNull),
        defaultValue: '',
    },
    google_id: {
        yupSchema: yup.string().nullable().defined().transform(emptyStringToNull),
        defaultValue: '',
    },
    goodreads_book_id: {
        yupSchema: yup.string().nullable().defined().transform(emptyStringToNull),
        defaultValue: '',
    },
    series: {
        yupSchema: yup.string().uppercase(),
        defaultValue: '',
    },
    series_position: {
        yupSchema: yup.string(),
        defaultValue: '',
    },
    rating: {
        yupSchema: yup.number().nullable().min(0).max(5)
            .transform((val, origVal) => trim(origVal) === '' ? null : Math.round(val * 10) / 10),
        defaultValue: '',
    },
    my_review: {
        yupSchema: yup.string(),
        defaultValue: '',
    },
    notes: {
        yupSchema: yup.string(),
        defaultValue: '',
    },
}

export const BOOK_FIELDS = Object.fromEntries(Object.keys(BOOK_SCHEMA).map(e => [e, e]));

// Coercion and validation done here.
// Further modification prior to submission is in 'onSubmit'.
export const YUP_SCHEMA = yup.object(Object.fromEntries(Object.entries(BOOK_SCHEMA)
    .map(([k, v]) => [k, v.yupSchema]))).noUnknown();

export const DEFAULT_BOOK_VALUES = Object.fromEntries(Object.entries(BOOK_SCHEMA)
    .map(([k, v]) => [k, v.defaultValue]))

export const transformBeforeSubmit = data => Object.fromEntries(
    Object.entries(data)
        .map(([k, v]) => [k,
            BOOK_SCHEMA[k].transformBeforeSubmit ?
                BOOK_SCHEMA[k].transformBeforeSubmit(v) :
                v
        ]))

/*Transforms server json into suitable datatype for presentation
* Will ignore and leave extraneous fields as they are (date_added, updated, id)
*
* For now will reverse authors, genres, type, date_read*/
export const transformToUserInput = ({data, authors, genres, types}) => {
    let clone = cloneDeep(data)

    clone.authors = data.authors.map(id => authors.find(e => e.id === id))
    clone.genres = data.genres.map(id => genres.find(e => e.id === id))
    clone.type = types.find(e => e.id === data.type) || null
    clone.date_read = new Date(data.date_read)
    return clone
}

/*Compare user input to data prior to transformation
* This function is expensive, so do not call onChange
* Note: test only VALIDATED data!!! */
export const isValidatedUserInputSame = (userInput, data) => {
    /*First check authors, genre, types
    * Order matters since I'm comparing arrays not sets*/
    if (!isEqual(data.authors.map(e => e.id), userInput.authors)) {
        console.log('authors not eq', data.authors.map(e => e.id), userInput.authors)
        return false
    }
    if (!isEqual(data.genres.map(e => e.id), userInput.genres)) {
        console.log('genres not eq')
        return false
    }
    if (parseInt(userInput.type) !== data.type.id) {
        console.log('types not eq', userInput.type, data.type.id)
        return false
    }
    if (!isEqual(userInput.date_read, formatISO(data.date_read, {representation: 'date'}))) {
        console.log('dates not eq', userInput.date_read, data.date_read)
        return false
    }

    // Then check the rest of the properties
    let rest = omit(userInput, ['authors', 'genres', 'type', 'date_read'])
    return Object.entries(rest).every(([k, v]) => {
        if (!(v === data[k]))
            console.log(`Field: ${k}, ${String(v)} === ${String(data[k])}`, v === data[k])
        return v === data[k]
    })

}