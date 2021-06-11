/**
 * Base and authentication endpoints
 * */
import {joinUrl} from "../shared/util";

/*Base*/
export const API_URL = 'https://api.nicholaslyz.com';
export const FILES_URL = 'https://files.nicholaslyz.com';
export const DUMMY_URL = 'https://dummy.nicholaslyz.com'

/*Authentication*/
export const LOGIN_URL = joinUrl(API_URL, 'account/login')
export const LOGOUT_URL = joinUrl(API_URL, 'account/logout')
export const RECAPTCHA_KEY_URL = joinUrl(API_URL, 'account/recaptcha-key')

/*Testing*/
export const TEST_URL = joinUrl(API_URL, 'test')