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
    Paper,
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

const StyledPaper = muiStyled(Paper)({
    'max-width': drawerWidth,
});

const StyledContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
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

const StyledContentContainer = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
`;


export const Navbar = ({title, drawerOpen, setDrawerOpen, children, returnToMainApp, logout, content}) => {
    const drawer = <StyledPaper>
        <List>
            <ListItem button onClick={returnToMainApp}>
                <ListItemIcon>
                    <ExitToAppIcon/>
                </ListItemIcon>
                <ListItemText primary={'Back to Apps'}/>
            </ListItem>
            {children}
            <ListItem button onClick={logout}>
                <ListItemIcon>
                    <MeetingRoomIcon/>
                </ListItemIcon>
                <ListItemText primary={'Logout'}/>
            </ListItem>
        </List>
    </StyledPaper>;

    return <StyledContainer>
        <HideOnScroll>
            <StyledAppBar position={'fixed'}>
                <Toolbar variant={"dense"}>
                    <IconButton color={"inherit"} onClick={() => setDrawerOpen(true)}>
                        <MenuIcon/>
                    </IconButton>
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
                <Drawer
                    open
                    variant={"permanent"}
                >{drawer}
                </Drawer>
            </Hidden>

        </StyledDrawerContainer>

        <StyledContentContainer>
            <Toolbar variant={"dense"}/>
            {content}
        </StyledContentContainer>


    </StyledContainer>
};