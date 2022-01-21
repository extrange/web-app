import { nanoid } from "@reduxjs/toolkit";
import faker from "@faker-js/faker";

export const fakeLists = [...Array(10)].map((_, idx) => ({
    id: nanoid(),
    title: `List ${idx}`,
}))

export const fakeItems = Object.fromEntries(fakeLists.map(e => [
    e.id,
    [...Array(10)].map((_, idx) => (
        {
            id: nanoid(),
            tasklist: e.id,
            title: faker.random.words(),
            notes: faker.random.words(),
            updated: faker.date.past().toISOString(),
            created: faker.date.past().toISOString(),
        }
    ))
]))