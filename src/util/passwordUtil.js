import {getSecureRandom} from "./util";
import {formatDistance} from "date-fns";

const DIGITS_REGEX = /\d/
const LOWER_REGEX = /[a-z]/
const UPPER_REGEX = /[A-Z]/
const SYMBOLS_REGEX = /[!@#$%^&*]/


const DIGITS = '0123456789'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SYMBOLS = '!@#$%^&*'

const secureRandom = getSecureRandom()
const formatNumber = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
    maximumSignificantDigits: 3,
})

/*Gets the entropy in bits for a password, assuming it is completely random*/
export const getEntropy = password => {

    let hasDigits = DIGITS_REGEX.test(password)
    let hasLowerCase = LOWER_REGEX.test(password)
    let hasUpperCase = UPPER_REGEX.test(password)
    let hasSymbols = SYMBOLS_REGEX.test(password)

    let totalSymbols =
        (hasDigits ? 10 : 0) +
        (hasLowerCase ? 26 : 0) +
        (hasUpperCase ? 26 : 0) +
        (hasSymbols ? SYMBOLS.length : 0)

    let bitsPerChar = Math.log2(totalSymbols)
    let totalEntropy = bitsPerChar * password.length

    return {
        length: password.length,
        hasDigits,
        hasLowerCase,
        hasUpperCase,
        hasSymbols,
        bitsPerChar,
        totalEntropy,
    }

}

export const generatePassword = ({length = 10, digits = true, lower = true, upper = true, symbols = true} = {}) => {

    if (length < 4) throw new Error('Password length is too short')

    let charSet =
        (digits ? DIGITS : '') +
        (lower ? LOWER : '') +
        (upper ? UPPER : '') +
        (symbols ? SYMBOLS : '')

    const generate = () => {
        let password = ''
        while (password.length < length)
            password += secureRandom.choice(charSet)
        return password
    }

    let password = generate()

    /*Ensure generated password meets criteria*/
    while ((digits && !DIGITS_REGEX.test(password)) ||
    (lower && !LOWER_REGEX.test(password)) ||
    (upper && !UPPER_REGEX.test(password)) ||
    (symbols && !SYMBOLS_REGEX.test(password))) {
        password = generate()
    }
    return password
}

window.test = generatePassword

export const getSha1Hash = async message => {
    const msgUint8 = new TextEncoder().encode(message);                            // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);    // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                      // convert buffer to byte array
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();       // convert bytes to hex string
}

export const generateUsername = ({length = 8} = {}) => {

    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const cons = ['b', 'c', 'd', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u', 'v', 'w', 'tr', 'cr', 'br', 'fr', 'th', 'dr', 'ch', 'ph', 'wr', 'st', 'sp', 'sw', 'pr', 'sl', 'cl'];

    const num_vowels = vowels.length;
    const num_cons = cons.length;
    let password = '';

    for (let i = 0; i < length; i++) {
        password += cons[Math.floor(secureRandom.random() * num_cons)] + vowels[Math.floor(secureRandom.random() * num_vowels)];
    }

    return password.substr(0, length);
}

export const formatLargeDuration = seconds => {
    if (seconds < 3.154e+7) {
        return formatDistance(new Date(0), new Date(seconds * 1000))
    }
    if (seconds > 4.4e+17) {
        return 'longer than the age of the Universe'
    }
    return formatNumber.format(seconds / 3.154e+7) + ' years';
}