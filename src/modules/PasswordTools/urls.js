import {API_URL} from "../../app/urls";


const PASSWORDS_API = `${API_URL}/passwords`;

export const HIBP_LOOKUP = hash => `${PASSWORDS_API}/lookup/?hash=${hash}`;