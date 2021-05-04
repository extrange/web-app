import QRCode from "qrcode.react";
import {formatDistanceToNowPretty} from "../../util/util";
import {parseJSON} from "date-fns";
import {Button, TextField} from "@material-ui/core";
import {useEffect, useState} from "react";
import {Networking} from "../../util/networking";
import {TWOFACTOR_URL} from "./urls";


export const TwoFactor = () => {

    const [otpStats, setOtpStats] = useState({})
    const [otpStatus, setOtpStatus] = useState(false)
    const [otp, setOtp] = useState('')
    const [secret, setSecret] = useState()

    const getOtpStatus = () => Networking.send(TWOFACTOR_URL)
        .then(r => r.json())
        .then(r => {
            setOtpStatus(r['2fa_enabled'])
            setOtpStats(r)
        })

    useEffect(() => void getOtpStatus(), [])

    const register = () => Networking.send(TWOFACTOR_URL, {
        method: Networking.POST,
        body: JSON.stringify({action: 'register'})
    })
        .then(r => r.json())
        .then(r => setSecret(r['otpauth_url']))

    const enable = () => Networking.send(TWOFACTOR_URL, {
        method: Networking.POST,
        body: JSON.stringify({action: 'enable', otp})
    }).then(r => r.json())
        .then(getOtpStatus)

    const disable = () => Networking.send(TWOFACTOR_URL, {
        method: Networking.POST,
        body: JSON.stringify({action: 'disable', otp})
    }).then(getOtpStatus)

    return <>{secret && <a href={secret}><QRCode
        value={secret}
    /></a>}
        <p>OTP is {Boolean(otpStatus) ? 'enabled' : 'disabled'}.</p>
        <p>Created: {otpStats['created'] && formatDistanceToNowPretty(parseJSON(otpStats['created']))}</p>
        <Button color={'primary'} variant={'contained'} onClick={register}>Register</Button>
        <Button color={'primary'} variant={'contained'} onClick={enable}>Enable</Button>
        <Button color={'secondary'} variant={'contained'} onClick={disable}>Disable</Button>
        <TextField
            value={otp}
            onChange={e => setOtp(e.target.value)}
        />
    </>
}