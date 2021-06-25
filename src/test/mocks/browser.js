import { setupWorker } from "msw";
import { books } from "./books";
import { hmail } from "./hmail";
import { lists } from "./lists";

export const worker =
    setupWorker(
        ...books,
        ...lists,
        ...hmail
    );