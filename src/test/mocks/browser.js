import { setupWorker } from "msw";
import { books } from "./books";
import { hmail } from "./hmail";
import { lists } from "./lists";
import { login } from "./login";
import { testing } from './testing';

export const worker =
    setupWorker(
        ...login,
        ...books,
        ...lists,
        ...hmail,
        ...testing
    );