import {AppBarResponsive} from "../../shared/AppBarResponsive";
import {useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography} from "@material-ui/core";
import QRCode from 'qrcode.react'
import {Networking} from "../../util/networking";
import {SESSION_MANAGEMENT_URL, TWOFACTOR_URL} from "./urls";
import {formatDistanceToNowStrict, parseJSON} from "date-fns";


export const Account = ({returnToMainApp, logout}) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [otpStatus, setOtpStatus] = useState(false)
    const [otpStats, setOtpStats] = useState({})
    const [otp, setOtp] = useState('')
    const [secret, setSecret] = useState()

    const [sessions, setSessions] = useState([])

    const getSessions = () => Networking.send(SESSION_MANAGEMENT_URL)
        .then(r => r.json())
        .then(r => setSessions(r))

    const logoutSession = logout => Networking.send(SESSION_MANAGEMENT_URL, {method: Networking.POST, body: JSON.stringify({logout})})
        .then(getSessions)

    const getOtpStatus = () => Networking.send(TWOFACTOR_URL)
        .then(r => r.json())
        .then(r => {
        setOtpStatus(r['2fa_enabled'])
        setOtpStats(r)
    })

    useEffect(() =>  {
        void getOtpStatus()
        void getSessions()
    }, [])

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

    return <AppBarResponsive
        appName={'Account'}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        titleContent={<Typography variant={'h6'}>Account</Typography>}
        logout={logout}
        returnToMainApp={returnToMainApp}
    >
        {secret && <a href={secret}><QRCode
            value={secret}
        /></a>}
        <p>OTP is {Boolean(otpStatus) ? 'enabled' : 'disabled'}.</p>
        <p>Created: {otpStats['created'] && formatDistanceToNowStrict(parseJSON(otpStats['created']), {addSuffix: true})}</p>
        <p>Last verified: {otpStats['last_verification'] && formatDistanceToNowStrict(parseJSON(otpStats['last_verification']), {addSuffix: true})}</p>
        <Button color={'primary'} variant={'contained'} onClick={register}>Register</Button>
        <Button color={'primary'} variant={'contained'} onClick={enable}>Enable</Button>
        <Button color={'secondary'} variant={'contained'} onClick={disable}>Disable</Button>
        <TextField
            value={otp}
            onChange={e => setOtp(e.target.value)}
        />
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>IP</TableCell>
                    <TableCell>User-Agent</TableCell>
                    <TableCell>Last Activity</TableCell>
                    <TableCell>Current Session</TableCell>
                    <TableCell>Logout</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {sessions.map(e => <TableRow>
                    <TableCell>{e.id}</TableCell>
                    <TableCell>{e.ip}</TableCell>
                    <TableCell>{e.user_agent}</TableCell>
                    <TableCell>{e.last_activity}</TableCell>
                    <TableCell>{String(e.is_current_session)}</TableCell>
                    <TableCell><Button variant={'contained'} onClick={() => logoutSession(e.id)}>Logout</Button></TableCell>
                </TableRow>)}
            </TableBody>
        </Table>
    </AppBarResponsive>
}