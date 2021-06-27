import { Button, TextField, Typography } from "@material-ui/core";
import { parseJSON } from "date-fns";
import QRCode from "qrcode.react";
import { useState } from "react";
import { formatDistanceToNowPretty } from "../../shared/util";
import { useModify2FaMutation, useGetOtpStatusQuery } from "./accountApi";

export const TwoFactor = () => {

    const [otp, setOtp] = useState('');
    const [secret, setSecret] = useState();

    const { data: otpStatus } = useGetOtpStatusQuery()
    const [modify2Fa] = useModify2FaMutation()

    const register = () =>
        modify2Fa({ action: 'register' })
            .unwrap()
            .then(r => setSecret(r['otpauth_url']));

    const enable = () => modify2Fa({ action: 'enable', otp })

    const disable = () => modify2Fa({ action: 'disable', otp })

    if (!otpStatus) return null

    return <>
        {secret && <a href={secret}><QRCode value={secret} /></a>}
        <Typography variant={'body1'}>OTP is {otpStatus['2fa_enabled'] ? 'enabled' : 'disabled'}.</Typography>
        <Typography
            variant={'body1'}>Created: {otpStatus['created'] && formatDistanceToNowPretty(parseJSON(otpStatus['created']))}</Typography>
        <Button color={'primary'} variant={'contained'} onClick={register}>Register</Button>
        <Button color={'primary'} variant={'contained'} onClick={enable}>Enable</Button>
        <Button color={'secondary'} variant={'contained'} onClick={disable}>Disable</Button>
        <TextField
            value={otp}
            onChange={e => setOtp(e.target.value)}
        />
    </>
};