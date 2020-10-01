/**
 * Convenience URL-related methods for Literature app
 */
import {API_URL} from "../urls";
import {Networking} from "../util";

// Schema Mapping
export const schema = {
    authors: 'authors',
    genre: 'genre',
};

//Static URls
export const LIT_API = `${API_URL}/literature`;

export const BOOKS = `${LIT_API}/books/`;
export const getBookDetail = id => `${BOOKS}${id}/`;

export const AUTHORS = `${LIT_API}/authors/`;
export const getAuthorDetail = id => `${AUTHORS}${id}/`;

export const GENRES = `${LIT_API}/genres/`;
export const getGenreDetail = id => `${GENRES}${id}/`;

export const TYPES = `${LIT_API}/types/`;
export const getTypeDetail = id => `${TYPES}${id}/`;

export const SEARCH = `${LIT_API}/search/`;
export const BOOK_INFO = `${LIT_API}/bookinfo/`;

//Convenience methods
export const [getAuthors, addAuthor, updateAuthor, deleteAuthor] = Networking.crudMethods(AUTHORS, getAuthorDetail);
export const [getGenres, addGenre, updateGenre, deleteGenre] = Networking.crudMethods(GENRES, getGenreDetail);
export const [getTypes, addType, updateType, deleteType] = Networking.crudMethods(TYPES, getTypeDetail);

//Mapping of names from JS to Python
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
    goodreadsId: 'goodreads_id',
    series: 'series',
    seriesPosition: 'series_position',
    rating: 'rating',
    myReview: 'my_review',
    notes: 'notes',
}

//Submission
export const submit = values => Networking.send(BOOKS, {
    method: Networking.POST,
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(values)
});