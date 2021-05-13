import {Button, Card, CardActionArea, CardActions, CardContent, Chip, Typography} from "@material-ui/core";
import {formatDistanceToNowPretty, prettifyUAString} from "../../util/util";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import PublicIcon from '@material-ui/icons/Public';
import {format, parseJSON} from "date-fns";
import styled from "styled-components";
import {theme} from "../../globals/theme";
import ChromeLogo from '../../browserLogos/chrome.png'
import FirefoxLogo from '../../browserLogos/firefox.png'
import EdgeLogo from '../../browserLogos/edge.png'
import SafariLogo from '../../browserLogos/safari.png'
import {useState} from "react";
import {getName} from "country-list";

const StyledCard = styled(Card)`
  outline: ${props => props.$thisDevice ? '2px solid ' + theme.palette.primary.main : 'none'};
`;

const StyledTypography = styled(Typography)`
  margin: 10px 0;
`;

const ImageDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SavedBrowserDiv = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: flex-end;
`;

const BrowserLogoDiv = styled.div`
  background: no-repeat url(${props => props.$image}) center/contain;
  margin: 0 6px;
  width: 32px;
  height: 32px
`;

const CardContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const BrowserLogo = {
    Chrome: ChromeLogo,
    Firefox: FirefoxLogo,
    Edge: EdgeLogo,
    Safari: SafariLogo,
};

export const BrowserCard = ({
                                browser: {
                                    id,
                                    is_active,
                                    is_current_session,
                                    is_saved,
                                    first_login,
                                    last_activity,
                                    ip,
                                    country_code,
                                    user_agent,
                                },
                                forgetAndLogoutBrowser,
                            }) => {

    const prettifiedUserAgent = prettifyUAString(user_agent);
    const browserName = prettifiedUserAgent.browserName;
    const [detailView, setDetailView] = useState(false);

    return <>
        <StyledCard $thisDevice={is_current_session} key={id}>
            <CardContainer>
                <CardActionArea onClick={() => setDetailView(!detailView)}>
                    <CardContent>
                        {detailView ?
                            <>
                                <Typography variant={'body1'}>First Login</Typography>
                                <Typography variant={'body2'}
                                            color={'textSecondary'}>{format(parseJSON(first_login), 'PPpp')}</Typography>
                                <Typography variant={'body1'}>Last Activity</Typography>
                                <Typography variant={'body2'}
                                            color={'textSecondary'}>{format(parseJSON(last_activity), 'PPpp')}</Typography>
                                <Typography variant={'body1'}>User-Agent</Typography>
                                <Typography variant={'body2'} color={'textSecondary'}>{user_agent}</Typography>

                            </> :
                            <>
                                <ImageDiv>
                                    {prettifiedUserAgent.isMobile ? <PhoneIphoneIcon/> : <DesktopWindowsIcon/>}
                                    {browserName in BrowserLogo ? <BrowserLogoDiv $image={BrowserLogo[browserName]}/> :
                                        <PublicIcon/>}
                                    <SavedBrowserDiv>
                                        {is_saved && <Chip label={'Saved'} color={'primary'}/>}
                                    </SavedBrowserDiv>
                                </ImageDiv>

                                <StyledTypography variant={'body1'}>{prettifiedUserAgent.name}</StyledTypography>
                                <Typography variant={'body2'}>{getName(country_code)}</Typography>
                                <Typography variant={'body2'} style={{overflowWrap: 'break-word'}}>{ip}</Typography>
                                <StyledTypography variant={'body2'}
                                                  color={'textSecondary'}>{formatDistanceToNowPretty(parseJSON(last_activity))}</StyledTypography>
                            </>
                        }
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {(is_active || is_saved) ?
                        <Button color={'primary'}
                                onClick={() => forgetAndLogoutBrowser(id)}>
                            {is_active ? 'Logout' : 'Forget'}
                        </Button> :
                        null}
                </CardActions>
            </CardContainer>
        </StyledCard>
    </>
};