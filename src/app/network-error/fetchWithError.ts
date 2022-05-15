import { store } from "../store";
import { setNetworkError } from "../appSlice";
import { stripHtml } from "../../shared/util";

/*Parse body as JSON only if content-type is JSON*/
const responseHandler = (response: Response) =>
  response.headers.get("content-type")?.trim()?.startsWith("application/json")
    ? response.json()
    : response.text();

/* Sets 'http' or 'fetch' errors accordingly */
export const fetchWithError: (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response> = async (input, init) => {
  const request = new Request(input, init);

  let response: Response;
  try {
    response = await fetch(input, init);
    const resultData = await responseHandler(response);

    if (response.status < 200 || response.status > 299) {
      store.dispatch(
        setNetworkError({
          type: "http",
          method: request.method,
          status: response.status,
          text:
            typeof resultData === "object"
              ? JSON.stringify(resultData, undefined, 2)
              : stripHtml(resultData),
          url: request.url,
        })
      );
    }
  } catch (e) {
    store.dispatch(
      setNetworkError({
        type: "fetch",
        method: request.method,
        text: e instanceof Error ? `${e.name}: ${e.message}` : String(e),
        url: request.url,
      })
    );
    throw e;
  }

  return response;
};
