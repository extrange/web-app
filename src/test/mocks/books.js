import { rest } from 'msw';
import { API_URL } from './../../app/urls';
import { staticFakeBookData } from "./fakeBookData";

const urls = {
    BOOKS: API_URL + '/literature/books/',
    AUTHORS: API_URL + '/literature/authors/',
    GENRES: API_URL + '/literature/genres/',
    TYPES: API_URL + '/literature/types/',
}

let id = 100;
const authors = [...Array(30)].map((val, id) => ({ id, name: `Author${id}`, notes: `notes${id}` }));
const genres = [...Array(30)].map((val, id) => ({ id, name: `Genre${id}`, notes: `notes${id}` }));
const types = [...Array(30)].map((val, id) => ({ id, name: `Type${id}`, notes: `notes${id}` }));
// const fakeBooks = generateFakeBookData(authors, genres, types)

export const books = [
    /*Literature: Books*/
    rest.get(urls.BOOKS, ((req, res, context) => {
        return res(
            context.status(200),
            context.json(staticFakeBookData)
        )
    })),

    rest.delete(urls.BOOKS + ':book/', (req, res, context) => {
        const { book } = req.params
        const idx = staticFakeBookData.findIndex(e => e.id === book)
        if (idx !== -1)
            return res(
                context.delay(10000),
                context.status(200),
            )
        else
            return res(
                context.delay(),
                context.status(404),
                context.json({ message: 'Book not found' })
            )
    }),

    /* Literature: Authors*/
    rest.get(urls.AUTHORS, (req, res, context) => {
        return res(
            context.status(200),
            context.json(authors)
        )
    }),
    rest.post(urls.AUTHORS, (req, res, context) => {
        let name = req.body['name'];
        if (name && !authors.find(e => e.name === name)) {
            let newAuthor = { id: id++, name, notes: '' };
            authors.push(newAuthor);
            return res(
                context.status(201),
                context.json(newAuthor),
                context.delay(10000)
            );
        } else return res(
            context.status(400),
            context.text('Bad request')
        )
    }),

    /* Literature: Genres*/
    rest.get(urls.GENRES, (req, res, context) => {
        return res(
            context.status(200),
            context.json(authors)
        )
    }),
    rest.post(urls.GENRES, (req, res, context) => {
        let name = req.body['name'];
        if (name && !genres.find(e => e.name === name)) {
            let newGenre = { id: id++, name, notes: '' };
            genres.push(newGenre);
            return res(
                context.status(201),
                context.json(newGenre),
                context.delay(10000)
            );
        } else return res(
            context.status(400),
            context.text('Bad request')
        )
    }),

    /* Literature: Types*/
    rest.get(urls.TYPES, (req, res, context) => {
        return res(
            context.status(200),
            context.json(types)
        )
    }),
    rest.post(urls.TYPES, (req, res, context) => {
        let name = req.body['name'];
        if (name && !types.find(e => e.name === name)) {
            let newType = { id: id++, name, notes: '' };
            types.push(newType);
            return res(
                context.status(201),
                context.json(newType),
                context.delay(3000)
            );
        } else return res(
            context.status(400),
            context.text('Bad request')
        )
    })
];