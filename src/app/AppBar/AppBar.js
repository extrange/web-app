import {
    AppBar as MuiAppBar,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Slide,
    Toolbar,
    Typography,
    useMediaQuery,
    useScrollTrigger,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import {styled as muiStyled, useTheme} from "@material-ui/core/styles"
import styled from 'styled-components'
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {BACKGROUND_COLOR} from "../../shared/components/backgroundScreen";
import {OverlayScrollbarOptions} from "../theme";
import {NotificationMenu} from "./notificationMenu";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentModule, setCurrentModule} from "../appSlice";
import React from "react";
import {MODULES} from "../modules";
import {useLogoutMutation} from "../authApi";

/*StyledContainer is a flex container for StyledDrawerContainer (flex: 1 0),
HideOnScroll (flex: 0 0) and StyledContentContainer (flex: 1 0)*/

const drawerWidth = 300;

const OverlayScrollbarsWithMaxWidth = styled(OverlayScrollbarsComponent)`
  width: ${drawerWidth}px;
  max-width: 80vw;
`;


const TransparentDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    ${BACKGROUND_COLOR};
  }
`;

const FlexContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const TransparentAppBar = muiStyled(MuiAppBar)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },

    '@supports (backdrop-filter: blur(10px))': {
        'backdrop-filter': 'blur(10px)',
    },

    background: 'rgba(0,0,0,0.6)',

}));

const StyledDrawerContainer = muiStyled('div')(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
    },

}));

const StyledContentContainer = styled.div`
  flex: 1;
`;

const ContentDiv = styled.div`
  height: calc(100% - 48px); //48px is the height of Toolbar (variant=dense)
`;

const StyledAppNameDiv = styled.div`
  font-family: 'Starcraft', serif;
  font-size: 20px;
  margin: 0 auto;
  text-align: center;
  cursor: default;
`;

const StyledIconButton = muiStyled(IconButton)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none',
    }
}));

/*Shared App Bar among modules*/
export const AppBar = ({
                           children,
                           drawerContent,
                           drawerOpen,
                           setDrawerOpen,
                           sidebarName: _sidebarName, /*Optional, defaults to module's displayName*/

                           /*Optional, defaults to module's displayName
                            Typography h6 is recommended with 'noWrap'*/
                           titleContent: _titleContent,
                       }) => {

    const dispatch = useDispatch()

    const [logout] = useLogoutMutation()

    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));
    const currentModule = useSelector(selectCurrentModule)
    const displayName = MODULES[currentModule].displayName

    const sidebarName = _sidebarName ?? displayName
    const titleContent = _titleContent ?? <Typography variant={"h6"} noWrap>{displayName}</Typography>

    const HideOnScroll = ({children, target}) => {
        const trigger = useScrollTrigger({threshold: 50, target});
        return <Slide direction={'down'} in={!trigger}>
            {children}
        </Slide>
    };

    const drawer = <OverlayScrollbarsWithMaxWidth
        options={OverlayScrollbarOptions}
        className={'os-host-flexbox'}>
        <List>
            <ListItem>
                <StyledAppNameDiv>{sidebarName}</StyledAppNameDiv>
            </ListItem>
            <ListItem button onClick={() => dispatch(setCurrentModule())}>
                <ListItemIcon>
                    <ArrowBackIcon/>
                </ListItemIcon>
                <ListItemText primary={'Back to Apps'}/>
            </ListItem>
            {drawerContent}
            <ListItem button onClick={() => logout()}>
                <ListItemIcon>
                    <MeetingRoomIcon/>
                </ListItemIcon>
                <ListItemText primary={'Logout'}/>
            </ListItem>
        </List>
    </OverlayScrollbarsWithMaxWidth>;

    return <FlexContainer>
        <HideOnScroll>
            <TransparentAppBar
                position={'fixed'}
                color={'transparent'}

                // Elevation adds more borders, and makes the page look more busy
                elevation={0}>
                <Toolbar variant={"dense"}>
                    <StyledIconButton
                        color={"inherit"}
                        edge={'start'}
                        onClick={() => setDrawerOpen(true)}>
                        <MenuIcon/>
                    </StyledIconButton>
                    {titleContent}
                    <div style={{flex: 1}}/>
                    <NotificationMenu/>
                </Toolbar>
            </TransparentAppBar>
        </HideOnScroll>

        <StyledDrawerContainer>
            {mobile
                ? <Drawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >{drawer}
                </Drawer>
                : <TransparentDrawer
                    open
                    variant={"permanent"}
                >{drawer}
                </TransparentDrawer>}
        </StyledDrawerContainer>


        <StyledContentContainer>
            <Toolbar variant={"dense"}/>
            <ContentDiv>
                {children}
            </ContentDiv>
        </StyledContentContainer>

    </FlexContainer>
};