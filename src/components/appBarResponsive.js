import {HideOnScroll} from "./common";
import {
    AppBar,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import React from "react";
import {styled as muiStyled} from "@material-ui/core/styles"
import styled from 'styled-components'
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";

/*StyledContainer is a flex container for StyledDrawerContainer (flex: 1 0),
HideOnScroll (flex: 0 0) and StyledContentContainer (flex: 1 0)*/

const drawerWidth = 300;

const OverlayScrollbarsWithMaxWidth = styled(OverlayScrollbarsComponent)`
    width: ${drawerWidth}px;
    max-width: 80vw;
    height: 100%; // This was the key to making OverlayScrollbars work!!
`;

const TransparentDrawer = styled(Drawer)`
    .MuiDrawer-paper {
        background: none;
    }
`;

const FlexContainer = styled.div`
    display: flex;
    height: 100vh;
`;

const StyledAppBar = muiStyled(AppBar)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
}));

const StyledDrawerContainer = muiStyled('div')(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
    },
}));

const StyledContentContainer = styled(OverlayScrollbarsComponent)`
    height: 100%;
    width: 100%;
`;

const StyledIconButton = muiStyled(IconButton)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none',
    }
}));


export const AppBarResponsive = ({
                                     title,
                                     drawerOpen,
                                     setDrawerOpen,
                                     drawerContent,
                                     children,
                                     returnToMainApp,
                                     logout
                                 }) => {

    const drawer = <OverlayScrollbarsWithMaxWidth
        options={{
            className: 'os-theme-light',
            nativeScrollbarsOverlaid: {
                initialize: false,
            },
            overflowBehavior: {
                x: 'hidden'
            },
            scrollbars: {
                autoHide: 'move',
            }
        }}>
        <List>
            <ListItem button onClick={returnToMainApp}>
                <ListItemIcon>
                    <ExitToAppIcon/>
                </ListItemIcon>
                <ListItemText primary={'Back to Apps'}/>
            </ListItem>
            {drawerContent}
            <ListItem button onClick={logout}>{/*Todo make button fixed at bottom to prevent layout jumps*/}
                <ListItemIcon>
                    <MeetingRoomIcon/>
                </ListItemIcon>
                <ListItemText primary={'Logout'}/>
            </ListItem>
        </List>
    </OverlayScrollbarsWithMaxWidth>;

    return <FlexContainer>
        <HideOnScroll>
            <StyledAppBar
                position={'fixed'}
                color={'transparent'}
                elevation={0}
            >
                <Toolbar variant={"dense"}>
                    <StyledIconButton
                        color={"inherit"}
                        edge={'start'}
                        onClick={() => setDrawerOpen(true)}>
                        <MenuIcon/>
                    </StyledIconButton>
                    <Typography variant={'h6'}>
                        {title}
                    </Typography>
                </Toolbar>
            </StyledAppBar>
        </HideOnScroll>

        <StyledDrawerContainer>
            <Hidden mdUp>
                <Drawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >{drawer}
                </Drawer>
            </Hidden>

            <Hidden smDown>
                <TransparentDrawer
                    open
                    variant={"permanent"}
                >{drawer}
                </TransparentDrawer>
            </Hidden>

        </StyledDrawerContainer>


        <StyledContentContainer
            options={{
                className: 'os-theme-light',
                nativeScrollbarsOverlaid: {
                    initialize: false,
                },
                overflowBehavior: {
                    x: 'hidden'
                },
                scrollbars: {
                    autoHide: 'move',
                }
            }}>
            <Toolbar variant={"dense"}/>
            {children}
        </StyledContentContainer>


    </FlexContainer>
};