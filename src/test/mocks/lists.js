import { nanoid } from "@reduxjs/toolkit";
import { rest } from "msw";
import { API_URL } from "../../app/urls";
import { fakeItems, fakeLists } from "./fakeListData";

export const lists = [
    rest.get(API_URL + '/tasks/tasklists/', (req, res, context) => {
        return res(
            context.delay(),
            context.status(200),
            context.json(fakeLists)
        )
    }),

    rest.post(API_URL + '/tasks/tasklists/', (req, res, context) => {
        let { title } = req.body
        let newList = {
            id: nanoid(),
            title
        }
        fakeLists.unshift(newList)
        return res(
            context.delay(),
            context.status(200),
            context.json(newList)
        )
    }),

    rest.put(API_URL + '/tasks/tasklists/:list/', (req, res, context) => {
        const { list } = req.params
        const { title } = req.body
        const obj = fakeLists.find(e => e.id === list)
        Object.assign(obj, { title })
        return res(
            context.delay(),
            context.status(200),
            context.json(obj)
        )
    }),

    rest.delete(API_URL + '/tasks/tasklists/:list/', (req, res, context) => {
        const { list } = req.params
        const idx = fakeLists.findIndex(e => e.id === list)
        if (idx !== -1) {
            fakeLists.splice(idx, 1)
            return res(
                context.delay(),
                context.status(200),
            )
        }
        return res(
            context.delay(),
            context.status(404),
            context.json({ message: 'List not found' })
        )
    }),


    rest.get(API_URL + '/tasks/tasklists/:list/tasks/', (req, res, context) => {
        const { list } = req.params
        if (!!fakeItems[list]) {
            return res(
                context.delay(),
                context.status(200),
                context.json(fakeItems[list])
            )
        }
        return res(
            context.status(404),
            context.json({ message: 'Not found' })
        )
    }),
    rest.post(API_URL + '/tasks/tasklists/:list/tasks/', async (req, res, context) => {
        const { title, notes, tasklist: list } = req.body
        if (!(list in fakeItems)) {
            return res(
                context.status(400),
                context.json({ message: 'List not found' })
            )
        }
        const newItem = {
            id: nanoid(),
            tasklist: list,
            title,
            notes,
            updated: new Date().toISOString(),
            created: new Date().toISOString(),
        }

        fakeItems[list].unshift(newItem)
        return res(
            context.delay(3000),
            context.status(200),
            context.json(newItem)
        )
    }),
    rest.put(API_URL + '/tasks/tasklists/:list/tasks/:item/', (req, res, context) => {
        const { list, item } = req.params
        const { title, notes } = req.body
        if (!(list in fakeItems) || !fakeItems[list].find(e => e.id === item)) {
            return res(
                context.status(404),
                context.json({ message: 'List not found' })
            )
        }
        const editedItem = fakeItems[list].find(e => e.id === item)
        Object.assign(editedItem, { title, notes, updated: new Date().toISOString })
        return res(
            context.delay(),
            context.status(200),
            context.json(editedItem)
        )
    }),
    rest.delete(API_URL + '/tasks/tasklists/:list/tasks/:item/', (req, res, context) => {
        const { item, list } = req.params
        if (!(list in fakeItems) || !fakeItems[list].find(e => e.id === item)) {
            return res(
                context.status(404),
                context.json({ message: 'List not found' })
            )
        }
        fakeItems[list].splice(fakeItems[list].findIndex(e => e.id === item), 1)
        return res(
            context.delay(),
            context.status(200)
        )
    })
]