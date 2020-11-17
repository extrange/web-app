import {HideOnScroll} from "./common";
import {
    AppBar,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import React from "react";
import muiStyled from "@material-ui/core/styles/styled"


const StyledPaper = muiStyled(Paper)({
    'max-width': '80vw'
});

export const Navbar = ({title, drawerOpen, setDrawerOpen, children, returnToMainApp, logout}) => {
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

    return <>
        <HideOnScroll>
            <AppBar position={'sticky'}>
                <Toolbar variant={'dense'}>
                    <IconButton color={"inherit"} onClick={() => setDrawerOpen(true)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant={'h6'}>
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
        </HideOnScroll>


        <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
        >{drawer}
        </Drawer>

    </>
};