import {AppBarResponsive} from "../../shared/AppBarResponsive";
import {useEffect, useState} from "react";
import {Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography} from "@material-ui/core";
import QRCode from 'qrcode.react'
import {Networking} from "../../util/networking";
import {getSavedBrowserDetail, SAVED_BROWSERS_URL, SESSION_MANAGEMENT_URL, TWOFACTOR_URL} from "./urls";
import {formatDistanceToNowStrict, parseJSON} from "date-fns";
import {BackgroundScreen} from "../../shared/backgroundScreen";
import CheckIcon from '@material-ui/icons/Check';
import UAParser from 'ua-parser-js'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const fpPromise = FingerprintJS.load();

(async () => {
  // Get the visitor identifier when you need it.
  const fp = await fpPromise
  const result = await fp.get()

  // This is the visitor identifier:
  const visitorId = result.visitorId
  console.log(visitorId)
})()

export const Account = ({returnToMainApp, logout}) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [otpStatus, setOtpStatus] = useState(false)
    const [otpStats, setOtpStats] = useState({})
    const [otp, setOtp] = useState('')
    const [secret, setSecret] = useState()

    const [sessions, setSessions] = useState([])
    const [savedBrowsers, setSavedBrowsers] = useState([])

    const prettifyUAString = uaString => {
        let ua = UAParser(uaString)
        let {
            browser: {
                name: browserName,
                version: browserVersion
            },
            // if type is not set, it is mobile
            device: {model, type, vendor},
            os: {name: osName, version: osVersion}
        } = ua

        return {
            // prettified: `${browserName} ${browserVersion} on ${type ? `${model} (${osName} ${osVersion})` : `${osName} ${osVersion}`}`,
            isMobile: Boolean(type),
            prettified: uaString
        }
    }

    const getBrowsers = () => Networking.send(SAVED_BROWSERS_URL)
        .then(r => r.json())
        .then(r => setSavedBrowsers(r))

    const deleteBrowser = id => Networking.send(getSavedBrowserDetail(id), {method: Networking.DELETE})
        .then(getBrowsers)

    const getSessions = () => Networking.send(SESSION_MANAGEMENT_URL)
        .then(r => r.json())
        .then(r => setSessions(r))

    const deleteSession = id => Networking.send(SESSION_MANAGEMENT_URL + `${id}/`, {
        method: Networking.DELETE,
    })
        .then(getSessions)

    const getOtpStatus = () => Networking.send(TWOFACTOR_URL)
        .then(r => r.json())
        .then(r => {
            setOtpStatus(r['2fa_enabled'])
            setOtpStats(r)
        })

    useEffect(() => {
        void getOtpStatus()
        void getSessions()
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
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>IP</TableCell>
                        <TableCell>User-Agent</TableCell>
                        <TableCell>Last Activity</TableCell>
                        <TableCell>Current Session</TableCell>
                        <TableCell>Country Code</TableCell>
                        <TableCell>Logout</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sessions.map(e => <TableRow>
                        <TableCell>{e.ip}</TableCell>
                        <TableCell>{prettifyUAString(e.user_agent).prettified}</TableCell>
                        <TableCell>{formatDistanceToNowStrict(parseJSON(e.last_activity), {addSuffix: true})}</TableCell>
                        <TableCell>{e.is_current_session ? <CheckIcon/> : null}</TableCell>
                        <TableCell>{e.country_code}</TableCell>
                        <TableCell><Button variant={'contained'}
                                           onClick={() => deleteSession(e.id)}>Logout</Button></TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Country Code</TableCell>
                        <TableCell>User_agent</TableCell>
                        <TableCell>IP last accessed</TableCell>
                        <TableCell>last_login</TableCell>
                        <TableCell>Is currentBrowser</TableCell>
                        <TableCell>Forget</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {savedBrowsers.map(e => <TableRow>
                        <TableCell>{e.country_code}</TableCell>
                        <TableCell>{prettifyUAString(e.user_agent).prettified}</TableCell>
                        <TableCell>{e.ip_last_accessed}</TableCell>
                        <TableCell>{formatDistanceToNowStrict(parseJSON(e.last_login), {addSuffix: true})}</TableCell>
                        <TableCell>{e.is_current_browser ? <CheckIcon/> : null}</TableCell>
                        <TableCell><Button variant={'contained'}
                                           color={'secondary'}
                                           onClick={() => deleteBrowser(e.id)}>Forget</Button></TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </BackgroundScreen>

    </AppBarResponsive>
}