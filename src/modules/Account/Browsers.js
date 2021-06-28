import { Typography } from "@material-ui/core";
import { compareDesc, parseJSON } from "date-fns";
import styled from 'styled-components';
import { useForgetAndLogoutBrowserMutation, useGetBrowsersQuery } from "./accountApi";
import { BrowserCard } from "./BrowserCard";

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

    const [forgetAndLogoutBrowser] = useForgetAndLogoutBrowserMutation()
    const { data: browsers } = useGetBrowsersQuery()

    return <GridContainer>
        <Typography variant={'h5'} style={{ marginLeft: '10px' }}>Active Browsers</Typography>
        <Grid>
            {browsers && browsers
                .filter(e => e.is_active)
                .sort((a, b) => compareDesc(parseJSON(a.last_activity), parseJSON(b.last_activity)))
                .map(browser => <BrowserCard
                    key={browser.id}
                    browser={browser}
                    forgetAndLogoutBrowser={forgetAndLogoutBrowser}
                />)}
        </Grid>

        <Typography variant={'h5'} style={{ marginLeft: '10px' }}>Inactive Browsers</Typography>

        <Grid>
            {browsers && browsers
                .filter(e => !e.is_active)
                .sort((a, b) => compareDesc(parseJSON(a.last_activity), parseJSON(b.last_activity)))
                .map(browser => <BrowserCard
                    key={browser.id}
                    browser={browser}
                    forgetAndLogoutBrowser={forgetAndLogoutBrowser}
                />)}
        </Grid>
    </GridContainer>
};