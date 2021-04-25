import {API_URL} from "../../globals/urls";

const ACCOUNT_URL = `${API_URL}/account`
export const TWOFACTOR_URL = `${ACCOUNT_URL}/twofactor/`
export const SESSION_MANAGEMENT_URL = `${ACCOUNT_URL}/sessions/`
export const SAVED_BROWSERS_URL = `${ACCOUNT_URL}/saved-browsers/`
export const getSavedBrowserDetail = id => `${SAVED_BROWSERS_URL}${id}/`