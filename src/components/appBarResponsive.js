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

/*StyledContainer is a flex container for StyledDrawerContainer (flex: 1 0),
HideOnScroll (flex: 0 0) and StyledContentContainer (flex: 1 0)*/

const drawerWidth = 300;

const StyledMaxWidthDiv = styled.div`
    width: ${drawerWidth}px;
    max-width: 80vw;
    overflow-y: hidden; // Fixes x-scrollbar being visible
    padding-right: 15px;
    
    :hover {
        overflow-y: scroll;
    }
`;

const TransparentDrawer = styled(Drawer)`
    .MuiDrawer-paper {
        background: none;
    }
`;

const StyledContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
`;

const ResponsiveAppBar = muiStyled(AppBar)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
}));

const ResponsiveDrawerContainer = muiStyled('div')(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
    },
}));

const StyledContentContainer = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const HiddenIconButton = muiStyled(IconButton)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none',
    }
}));

const ResponsiveCenterDiv = muiStyled('div')(({theme}) => ({
    display: 'flex',
    width: '100%',
    [theme.breakpoints.up('md')]: {
        'justify-content': 'center',
    }
}))

export const AppBarResponsive = ({
                                     title,
                                     drawerOpen,
                                     setDrawerOpen,
                                     drawerContent,
                                     children,
                                     returnToMainApp,
                                     logout
                                 }) => {

    const drawer = <StyledMaxWidthDiv>
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
    </StyledMaxWidthDiv>;

    return <StyledContainer>
        <HideOnScroll>
            <ResponsiveAppBar
                position={'fixed'}
                color={'transparent'}
            >
                <Toolbar variant={"dense"}>
                    <HiddenIconButton
                        color={"inherit"}
                        edge={'start'}
                        onClick={() => setDrawerOpen(true)}>
                        <MenuIcon/>
                    </HiddenIconButton>
                    <ResponsiveCenterDiv>
                        <div style={{
                            filter: 'blur(50px)',
                            background: 'inherit',
                            ':before': {
                                content: 'eaoue',
                                background: 'red',
                                filter: 'blur(50px)'
                            }
                        }}/>
                        <Typography variant={'h6'}>
                            {title}
                        </Typography>
                    </ResponsiveCenterDiv>
                </Toolbar>
            </ResponsiveAppBar>
        </HideOnScroll>

        <ResponsiveDrawerContainer>
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

        </ResponsiveDrawerContainer>

        <StyledContentContainer>
            <Toolbar variant={"dense"}/>
            {children}
        </StyledContentContainer>


    </StyledContainer>
};