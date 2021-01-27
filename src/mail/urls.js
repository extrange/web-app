import {API_URL} from "../urls";
import {Networking} from "../util";

export const HMAIL_API = `${API_URL}/hmail`;

export const MOHH_MAIL_URL = `${HMAIL_API}/check-mohh-mail`

export const IHIS_MAIL_URL = `${HMAIL_API}/check-ihis-mail`

export const getMohhMail = () => Networking.send(MOHH_MAIL_URL, {method: 'GET'})
    .then(resp => resp.json());

export const getIhisMail = () => Networking.send(IHIS_MAIL_URL, {method: 'GET'})
    .then(resp => resp.json());