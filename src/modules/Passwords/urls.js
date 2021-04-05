import {API_URL} from "../../globals/urls";
import {Networking} from "../../util/networking";


const PASSWORDS_API = `${API_URL}/passwords`

const PASSWORDS = `${PASSWORDS_API}/entries/`
const getPasswordDetail = id => `${PASSWORDS}${id}/`

export const [getPasswords, addPassword, updatePassword, deletePassword] = Networking.crudMethods(PASSWORDS, getPasswordDetail)