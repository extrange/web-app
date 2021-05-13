import {rest} from 'msw'
import {AUTHORS, BOOKS, GENRES, TYPES} from "../../modules/Literature/urls";
import {staticFakeBookData} from "./fakeBookData";

let id = 100;
const authors = [...Array(20)].map((val, id) => ({id, name: `Author${id}`, notes: `notes${id}`}));
const genres = [...Array(20)].map((val, id) => ({id, name: `Genre${id}`, notes: `notes${id}`}));
const types = [...Array(20)].map((val, id) => ({id, name: `Type${id}`, notes: `notes${id}`}));
// const fakeBooks = generateFakeBookData(authors, genres, types)

export const handlers = [
    /*Literature: Books*/
    rest.get(BOOKS, ((req, res, context) => {
        return res(
            context.status(200),
            context.json(staticFakeBookData)
        )
    })),

    /* Literature: Authors*/
    rest.get(AUTHORS, (req, res, context) => {
        return res(
            context.status(200),
            context.json(authors)
        )
    }),
    rest.post(AUTHORS, (req, res, context) => {
        let name = req.body['name'];
        if (name && !authors.find(e => e.name === name)) {
            let newAuthor = {id: id++, name, notes: ''};
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
    rest.get(GENRES, (req, res, context) => {
        return res(
            context.status(200),
            context.json(authors)
        )
    }),
    rest.post(GENRES, (req, res, context) => {
        let name = req.body['name'];
        if (name && !genres.find(e => e.name === name)) {
            let newGenre = {id: id++, name, notes: ''};
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
    rest.get(TYPES, (req, res, context) => {
        return res(
            context.status(200),
            context.json(types)
        )
    }),
    rest.post(TYPES, (req, res, context) => {
        let name = req.body['name'];
        if (name && !types.find(e => e.name === name)) {
            let newType = {id: id++, name, notes: ''};
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