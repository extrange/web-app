import { getRandomInt } from "../../shared/util";
import faker from "faker";

const fakeMail = () => [...Array(getRandomInt(1, 5))].map((_, idx)=>({
    title: faker.random.words(),
    date: faker.date.past().toISOString(),
    unreadCount: 1,
    preview: faker.random.words(),
    from: [
        faker.random.word()
    ]
}))

export const fakeIhisMail = fakeMail()
export const fakeMohhMail = fakeMail()