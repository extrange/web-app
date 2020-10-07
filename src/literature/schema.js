/**
 * Schemas for Yup validation, default field values
 */

import * as yup from "yup";
import {isEmpty} from "lodash"

// This field will be null if omitted or a falsey value ('', undefined or null)
const blankStringToNull = yup.string().defined().transform(val => val ? val : null).default(null);

// Coerce empty strings to null, and force numbers otherwise
const emptyStringToNull = (val, origVal) => isEmpty(origVal) ? null : val;

export const resultType = {
    GOODREADS: 'goodreads',
    GOOGLE: 'google',
};


//Mapping of names from JS to Python TODO squeeze all these fields together instead of separately
export const bookFields = {
    authors: 'authors',
    genre: 'genre',
    type: 'type',
    title: 'title',
    description: 'description',
    readNext: 'read_next',
    dateRead: 'date_read',
    imageUrl: 'image_url',
    published: 'published',
    googleId: 'google_id',
    goodreadsBookId: 'goodreads_book_id',
    series: 'series',
    seriesPosition: 'series_position',
    rating: 'rating',
    myReview: 'my_review',
    notes: 'notes',
};

// Coercion and validation done here.
// Further modification prior to submission is in 'onSubmit'.
// todo merge bookSchema and defaultBookValues into one object so I don't duplicate
export const bookSchema = yup.object({
    [bookFields.authors]: yup.array(yup.object({id: yup.string().required()})), //modified later
    [bookFields.genre]: yup.array(yup.object({id: yup.string().required()})), //modified later
    [bookFields.type]: yup.object({id: yup.string().required()}).typeError('Required').required(), //modified later
    [bookFields.title]: yup.string().required(),
    [bookFields.description]: yup.string(),
    [bookFields.readNext]: yup.bool(),
    [bookFields.dateRead]: yup.date().typeError('Invalid date').nullable(), //modified later
    [bookFields.imageUrl]: yup.string().url(),
    [bookFields.published]: yup.number().integer().nullable().transform(emptyStringToNull),
    [bookFields.googleId]: blankStringToNull,
    [bookFields.goodreadsBookId]: blankStringToNull,
    [bookFields.series]: yup.string(),
    [bookFields.seriesPosition]: yup.string(),
    [bookFields.rating]: yup.number().nullable().transform(v => Math.round(v * 10) / 10).transform(emptyStringToNull).min(0).max(5),
    [bookFields.myReview]: yup.string(),
    [bookFields.notes]: yup.string(),
}).noUnknown();

export const defaultBookValues = {
    [bookFields.authors]: [],
    [bookFields.genre]: [],
    [bookFields.type]: null, //only one type allowed per book
    [bookFields.title]: '',
    [bookFields.description]: '',
    [bookFields.readNext]: false,
    [bookFields.dateRead]: null,
    [bookFields.imageUrl]: '',
    [bookFields.published]: '',
    [bookFields.googleId]: '',
    [bookFields.goodreadsBookId]: '',
    [bookFields.series]: '',
    [bookFields.seriesPosition]: '',
    [bookFields.rating]: null,
    [bookFields.myReview]: '',
    [bookFields.notes]: '',
};