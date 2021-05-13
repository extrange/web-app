import {API_URL} from "../../globals/urls";
import {Networking} from "../../util/networking";

const MOHH_MAIL_URL = `${API_URL}/hmail/check-mohh-mail`;
const IHIS_MAIL_URL = `${API_URL}/hmail/check-ihis-mail`;

export const HMAIL_URL = 'https://www.hmail.sg';

export const getMohhMail = () => Networking.send(MOHH_MAIL_URL, {method: 'GET'})
    .then(resp => resp.json());

export const getIhisMail = () => Networking.send(IHIS_MAIL_URL, {method: 'GET'})
    .then(resp => resp.json());