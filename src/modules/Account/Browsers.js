import {useEffect, useState} from "react";
import {BROWSERS_URL, getBrowserDetail} from "./urls";
import {Typography} from "@material-ui/core";
import {compareDesc, parseJSON} from "date-fns";
import styled from 'styled-components'
import {BrowserCard} from "./BrowserCard";
import {NETWORK_METHOD} from "../../app/constants";
import {send} from "../../app/appSlice";
import {useSend} from "../../shared/useSend";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
  gap: 20px 20px;
  margin: 20px;
`;
const GridContainer = styled.div`
  max-width: 1000px;
`;

export const Browsers = () => {
    const send = useSend()
    const [browsers, setDevices] = useState([]);

    const forgetAndLogoutBrowser = id =>
        send(getBrowserDetail(id), {method: NETWORK_METHOD.DELETE})
            .then(getBrowsers);

    const getBrowsers = () =>
        send(BROWSERS_URL)
            .then(r => setDevices(r));

    useEffect(() => void getBrowsers(), []);

    return <GridContainer>
        <Typography variant={'h5'} style={{marginLeft: '10px'}}>Active Browsers</Typography>
        <Grid>
            {browsers
                .filter(e => e.is_active)
                .sort((a, b) => compareDesc(parseJSON(a.last_activity), parseJSON(b.last_activity)))
                .map(browser => <BrowserCard
                    browser={browser}
                    forgetAndLogoutBrowser={forgetAndLogoutBrowser}
                />)}
        </Grid>

        <Typography variant={'h5'} style={{marginLeft: '10px'}}>Inactive Browsers</Typography>

        <Grid>
            {browsers
                .filter(e => !e.is_active)
                .sort((a, b) => compareDesc(parseJSON(a.last_activity), parseJSON(b.last_activity)))
                .map(browser => <BrowserCard
                    browser={browser}
                    forgetAndLogoutBrowser={forgetAndLogoutBrowser}
                />)}
        </Grid>
    </GridContainer>
};