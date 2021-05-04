import {useEffect, useState} from "react";
import {Networking} from "../../util/networking";
import {BROWSERS_URL, getBrowserDetail} from "./urls";
import {Typography} from "@material-ui/core";
import {compareDesc, parseJSON} from "date-fns";
import styled from 'styled-components'
import {BrowserCard} from "./BrowserCard";

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`


export const Browsers = () => {
    const [browsers, setDevices] = useState([])

    const forgetAndLogoutBrowser = id =>
        Networking.send(getBrowserDetail(id), {method: Networking.DELETE})
            .then(getBrowsers)

    const getBrowsers = () =>
        Networking.send(BROWSERS_URL)
            .then(r => r.json())
            .then(r => setDevices(r))

    useEffect(() => void getBrowsers(), [])

    return <>
        <Typography variant={'h5'} style={{marginLeft: '10px'}}>Active Browsers</Typography>
        <FlexContainer>
            {browsers
                .filter(e => e.is_active)
                .sort((a, b) => compareDesc(parseJSON(a.last_activity), parseJSON(b.last_activity)))
                .map(browser => <BrowserCard
                    browser={browser}
                    forgetAndLogoutBrowser={forgetAndLogoutBrowser}
                />)}
        </FlexContainer>

        <Typography variant={'h5'} style={{marginLeft: '10px'}}>Inactive Browsers</Typography>
        <FlexContainer>
            {browsers
                .filter(e => !e.is_active)
                .sort((a, b) => compareDesc(parseJSON(a.last_activity), parseJSON(b.last_activity)))
                .map(browser => <BrowserCard
                    browser={browser}
                    forgetAndLogoutBrowser={forgetAndLogoutBrowser}
                />)}
        </FlexContainer>
    </>
}