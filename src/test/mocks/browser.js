import { setupWorker } from "msw";
import { books } from "./books";
import { hmail } from "./hmail";
import { lists } from "./lists";
import { login } from "./login";

export const worker =
    setupWorker(
        ...login,
        ...books,
        ...lists,
        ...hmail
    );