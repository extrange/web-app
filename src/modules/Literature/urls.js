/**
 * Convenience URL-related methods for Literature app
 */
import {API_URL} from "../../app/urls";
import {crudMethods} from "../../app/appSlice";

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
export const [getBooks, addBook, updateBook, deleteBook] = crudMethods(BOOKS, getBookDetail);
export const [getAuthors, addAuthor, updateAuthor, deleteAuthor] = crudMethods(AUTHORS, getAuthorDetail);
export const [getGenres, addGenre, updateGenre, deleteGenre] = crudMethods(GENRES, getGenreDetail);
export const [getTypes, addType, updateType, deleteType] = crudMethods(TYPES, getTypeDetail);