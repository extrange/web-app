import { rest } from "msw";
import { API_URL } from "./../../app/urls";

let count = 0;

export const testing = [
  rest.get(API_URL + "/test/mutationTest/", (req, res, context) => {
    return res(
      context.delay(3000),
      context.status(200),
      context.json({ count: (count += 1) })
    );
  }),
];
