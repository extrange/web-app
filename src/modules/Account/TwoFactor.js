import QRCode from "qrcode.react";
import {formatDistanceToNowPretty} from "../../shared/util";
import {parseJSON} from "date-fns";
import {Button, TextField, Typography} from "@material-ui/core";
import {useEffect, useState} from "react";
import {TWOFACTOR_URL} from "./urls";
import {NETWORK_METHOD} from "../../app/constants";
import {useSend} from "../../shared/useSend";


export const TwoFactor = () => {

    const [otpStats, setOtpStats] = useState({});
    const [otpStatus, setOtpStatus] = useState(false);
    const [otp, setOtp] = useState('');
    const [secret, setSecret] = useState();
    const send = useSend()

    const getOtpStatus = () => send(TWOFACTOR_URL)
        .then(r => {
            setOtpStatus(r['2fa_enabled']);
            setOtpStats(r)
        });

    useEffect(() => void getOtpStatus(), []);

    const register = () => send(TWOFACTOR_URL, {
        method: NETWORK_METHOD.POST,
        body: {action: 'register'}
    })
        .then(r => setSecret(r['otpauth_url']));

    const enable = () => send(TWOFACTOR_URL, {
        method: NETWORK_METHOD.POST,
        body: {action: 'enable', otp}
    }).then(getOtpStatus);

    const disable = () => send(TWOFACTOR_URL, {
        method: NETWORK_METHOD.POST,
        body: {action: 'disable', otp}
    }).then(getOtpStatus);

    return <>
        {secret && <a href={secret}><QRCode value={secret}/></a>}
        <Typography variant={'body1'}>OTP is {Boolean(otpStatus) ? 'enabled' : 'disabled'}.</Typography>
        <Typography
            variant={'body1'}>Created: {otpStats['created'] && formatDistanceToNowPretty(parseJSON(otpStats['created']))}</Typography>
        <Button color={'primary'} variant={'contained'} onClick={register}>Register</Button>
        <Button color={'primary'} variant={'contained'} onClick={enable}>Enable</Button>
        <Button color={'secondary'} variant={'contained'} onClick={disable}>Disable</Button>
        <TextField
            value={otp}
            onChange={e => setOtp(e.target.value)}
        />
    </>
};