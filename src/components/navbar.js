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

const drawerWidth = 240;

const StyledPaper = muiStyled(Paper)({
    'max-width': '80vw'
});

const StyledContainer = styled.div`
    display: flex;
`;

const StyledDrawer = muiStyled('div')(({theme}) => ({
    [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
    },
}));

const StyledAppBar = muiStyled(AppBar)(({theme}) => ({
    [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    }
}));

const StyledContents = styled.div`
    flex: 1;
`;

export const Navbar = ({title, drawerOpen, setDrawerOpen, children, returnToMainApp, logout, content}) => {
    const drawer = <Paper>
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
    </Paper>;

    return <StyledContainer>
        <HideOnScroll>
            <StyledAppBar position={'sticky'}>
                <Toolbar variant={'dense'}>
                    <IconButton color={"inherit"} onClick={() => setDrawerOpen(true)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant={'h6'}>
                        {title}
                    </Typography>
                </Toolbar>
            </StyledAppBar>
        </HideOnScroll>

        <StyledDrawer>

            <Hidden smUp>
                <Drawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >{drawer}
                </Drawer>
            </Hidden>

            <Hidden xsDown>
                <Drawer
                    open
                    variant={"permanent"}
                >{drawer}
                </Drawer>
            </Hidden>

        </StyledDrawer>

        <StyledContents>
            {content}
        </StyledContents>


    </StyledContainer>
};