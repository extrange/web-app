import {getSecureRandom} from "../../util/util";

const DIGITS_REGEX = /\d/
const LOWER_REGEX = /[a-z]/
const UPPER_REGEX = /[A-Z]/
const SYMBOLS_REGEX = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/

const DIGITS = '0123456789'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'

const secureRandom = getSecureRandom()

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
        (hasSymbols ? 32 : 0)

    let bitsPerChar = Math.log2(totalSymbols)
    let totalEntropy = bitsPerChar * password.length

    return {
        hasDigits,
        hasLowerCase,
        hasUpperCase,
        hasSymbols,
        bitsPerChar,
        totalEntropy,
    }

}

export const generatePassword = (length, {digits = true, lower = true, upper = true, symbols = true} = {}) => {

    if (length < 4) throw new Error('Password length is too short')

    let charSet =
        (digits ? DIGITS : '') +
        (lower ? LOWER : '') +
        (upper ? UPPER : '') +
        (symbols ? SYMBOLS : '')

    let password = ''

    while (password.length < length)
        password += secureRandom.choice(charSet)

    /*Ensure generated password meets criteria*/
    if ((!digits || DIGITS_REGEX.test(password)) &&
        (!lower || LOWER_REGEX.test(password)) &&
        (!upper || UPPER_REGEX.test(password)) &&
        (!symbols || SYMBOLS_REGEX.test(password)))
        return password

    /*Otherwise regenerate*/
    return generatePassword(length, {digits, lower, upper, symbols})
}