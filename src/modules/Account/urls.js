import {API_URL} from "../../app/urls";

const ACCOUNT_URL = `${API_URL}/account`;
export const TWOFACTOR_URL = `${ACCOUNT_URL}/twofactor/`;
export const BROWSERS_URL = `${ACCOUNT_URL}/browsers/`;
export const getBrowserDetail = id => `${BROWSERS_URL}${id}/`;