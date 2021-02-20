/**
 * Convenience URL-related methods for Literature app
 */
import {API_URL} from "../../globals/urls";
import {Networking} from "../../util/networking";

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

// These methods get 'published', 'series_name', 'series_position', 'description'
export const getGoogleBookInfo = isbn => Networking.send(`${BOOK_INFO}?isbn=${isbn}`, {method: 'GET'})
    .then(resp => resp.json());

export const getGoodreadsBookInfo = (work_id, book_id) => Networking.send(`${BOOK_INFO}?work_id=${work_id}&book_id=${book_id}`, {method: 'GET'})
    .then(resp => resp.json());

//Convenience methods
export const [getBooks, addBook, updateBook, deleteBook] = Networking.crudMethods(BOOKS, getBookDetail)
export const [getAuthors, addAuthor, updateAuthor, deleteAuthor] = Networking.crudMethods(AUTHORS, getAuthorDetail);
export const [getGenres, addGenre, updateGenre, deleteGenre] = Networking.crudMethods(GENRES, getGenreDetail);
export const [getTypes, addType, updateType, deleteType] = Networking.crudMethods(TYPES, getTypeDetail);