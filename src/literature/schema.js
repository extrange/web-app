/**
 * Schemas for Yup validation, default field values
 */

import * as yup from "yup";

// Coerce empty strings to null, else return base coercion attempt
const emptyStringToNull = (val, origVal) => typeof origVal === 'string' && origVal === '' ? null : val;

export const resultType = {
    GOODREADS: 'goodreads',
    GOOGLE: 'google',
};

// todo merge bookSchema, defaultBookValues, bookFields, and maybe modifications into one object so I don't duplicate
//Mapping of names from JS to Python
export const bookFields = {
    authors: 'authors',
    genres: 'genres',
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
export const bookSchema = yup.object({
    [bookFields.authors]: yup.array(yup.object({id: yup.string().required()})), //modified later
    [bookFields.genres]: yup.array(yup.object({id: yup.string().required()})), //modified later
    [bookFields.type]: yup.object({id: yup.string().required()}).typeError('Required').required(), //modified later
    [bookFields.title]: yup.string().required(),
    [bookFields.description]: yup.string(),
    [bookFields.readNext]: yup.bool(),
    [bookFields.dateRead]: yup.date().typeError('Invalid date').nullable(), //modified later
    [bookFields.imageUrl]: yup.string().url(),
    [bookFields.published]: yup.number().integer().nullable().transform(emptyStringToNull),
    [bookFields.googleId]: yup.string().nullable().defined().transform(emptyStringToNull),
    [bookFields.goodreadsBookId]: yup.string().nullable().defined().transform(emptyStringToNull),
    [bookFields.series]: yup.string(),
    [bookFields.seriesPosition]: yup.string(),
    [bookFields.rating]: yup.number().nullable().transform(v => Math.round(v * 10) / 10).transform(emptyStringToNull).min(0).max(5),
    [bookFields.myReview]: yup.string(),
    [bookFields.notes]: yup.string(),
}).noUnknown();

export const defaultBookValues = {
    [bookFields.authors]: [],
    [bookFields.genres]: [],
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
    [bookFields.rating]: '',
    [bookFields.myReview]: '',
    [bookFields.notes]: '',
};