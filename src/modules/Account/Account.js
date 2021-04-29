import {AppBarResponsive} from "../../shared/AppBarResponsive";
import {useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography} from "@material-ui/core";
import QRCode from 'qrcode.react'
import {Networking} from "../../util/networking";
import {BROWSERS_URL, getBrowserDetail, TWOFACTOR_URL} from "./urls";
import {compareDesc, formatDistanceToNowStrict, parseJSON} from "date-fns";
import {BackgroundScreen} from "../../shared/backgroundScreen";
import CheckIcon from '@material-ui/icons/Check';
import UAParser from 'ua-parser-js'

export const Account = ({returnToMainApp, logout}) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [otpStatus, setOtpStatus] = useState(false)
    const [otpStats, setOtpStats] = useState({})
    const [otp, setOtp] = useState('')
    const [secret, setSecret] = useState()

    const [browsers, setDevices] = useState([])

    const prettifyUAString = uaString => {
        let ua = UAParser(uaString)
        let {
            browser: {
                name: browserName,
            },
            // if type is set, it is mobile
            device: {model, type},
            os: {name: osName, version: osVersion}
        } = ua

        return {
            prettified: `${browserName} on ${osName} ${osVersion}${model ? ` (${model})` : ''}`,
            isMobile: Boolean(type),
        }
    }

    const forgetAndLogoutBrowser = id => Networking.send(getBrowserDetail(id), {method: Networking.DELETE})
        .then(getBrowsers)

    const getBrowsers = () => Networking.send(BROWSERS_URL)
        .then(r => r.json())
        .then(r => setDevices(r))

    const getOtpStatus = () => Networking.send(TWOFACTOR_URL)
        .then(r => r.json())
        .then(r => {
            setOtpStatus(r['2fa_enabled'])
            setOtpStats(r)
        })

    useEffect(() => {
        void getOtpStatus()
        void getBrowsers()
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
        <BackgroundScreen>
            {secret && <a href={secret}><QRCode
                value={secret}
            /></a>}
            <p>OTP is {Boolean(otpStatus) ? 'enabled' : 'disabled'}.</p>
            <p>Created: {otpStats['created'] && formatDistanceToNowStrict(parseJSON(otpStats['created']), {addSuffix: true})}</p>
            <p>Last
                verified: {otpStats['last_verification'] && formatDistanceToNowStrict(parseJSON(otpStats['last_verification']), {addSuffix: true})}</p>
            <Button color={'primary'} variant={'contained'} onClick={register}>Register</Button>
            <Button color={'primary'} variant={'contained'} onClick={enable}>Enable</Button>
            <Button color={'secondary'} variant={'contained'} onClick={disable}>Disable</Button>
            <TextField
                value={otp}
                onChange={e => setOtp(e.target.value)}
            />
            Active Browsers
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>IP</TableCell>
                        <TableCell>User-Agent</TableCell>
                        <TableCell>Last Activity</TableCell>
                        <TableCell>This browser?</TableCell>
                        <TableCell>Country Code</TableCell>
                        <TableCell>Saved?</TableCell>
                        <TableCell>Logout & Forget</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {browsers.filter(e => e.is_active).sort((a, b) => compareDesc(parseJSON(a), parseJSON(b))).map(e =>
                        <TableRow key={e.id}>
                            <TableCell>{e.ip}</TableCell>
                            <TableCell>{prettifyUAString(e.user_agent).prettified}</TableCell>
                            <TableCell>{formatDistanceToNowStrict(parseJSON(e.last_activity), {addSuffix: true})}</TableCell>
                            <TableCell>{e.is_current_session ? <CheckIcon/> : null}</TableCell>
                            <TableCell>{e.country_code}</TableCell>
                            <TableCell>{e.is_saved ? <CheckIcon/> : null}</TableCell>
                            <TableCell><Button variant={'contained'}
                                               onClick={() => forgetAndLogoutBrowser(e.id)}>Logout</Button></TableCell>
                        </TableRow>)}
                </TableBody>
            </Table>
            Inactive Browsers
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>IP</TableCell>
                        <TableCell>User-Agent</TableCell>
                        <TableCell>Last Activity</TableCell>
                        <TableCell>This browser?</TableCell>
                        <TableCell>Country Code</TableCell>
                        <TableCell>Saved?</TableCell>
                        <TableCell>Forget</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {browsers.filter(e => !e.is_active).sort((a, b) => compareDesc(parseJSON(a.last_activity), parseJSON(b.last_activity))).map(e =>
                        <TableRow key={e.id}>
                            <TableCell>{e.ip}</TableCell>
                            <TableCell>{prettifyUAString(e.user_agent).prettified}</TableCell>
                            <TableCell>{formatDistanceToNowStrict(parseJSON(e.last_activity), {addSuffix: true})}</TableCell>
                            <TableCell>{e.is_current_session ? <CheckIcon/> : null}</TableCell>
                            <TableCell>{e.country_code}</TableCell>
                            <TableCell>{e.is_saved ? <CheckIcon/> : null}</TableCell>
                            <TableCell>{e.is_saved && <Button variant={'contained'}
                                                              onClick={() => forgetAndLogoutBrowser(e.id)}>Forget</Button>}</TableCell>
                        </TableRow>)}
                </TableBody>
            </Table>
        </BackgroundScreen>

    </AppBarResponsive>
}