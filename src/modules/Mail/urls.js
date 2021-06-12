import {API_URL} from "../../app/urls";
import {send} from "../../app/appSlice";

const MOHH_MAIL_URL = `${API_URL}/hmail/check-mohh-mail/`;
const IHIS_MAIL_URL = `${API_URL}/hmail/check-ihis-mail/`;

export const getMohhMail = () => send(MOHH_MAIL_URL, {method: 'GET'})
    .then(resp => resp.json());

export const getIhisMail = () => send(IHIS_MAIL_URL, {method: 'GET'})
    .then(resp => resp.json());