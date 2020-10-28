import {
    AppBar,
    SwipeableDrawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Slide,
    Toolbar,
    Typography,
    useScrollTrigger
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import React from "react";

export const HideOnScroll = ({children, ...props}) => {
    const trigger = useScrollTrigger({threshold: 50})
    return <Slide direction={'down'} in={!trigger}>
        {children}
    </Slide>
}
export const Navbar = ({title, drawerOpen, setDrawerOpen, children, returnToMainApp, logout, ...props}) => {

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
        <SwipeableDrawer
            open={drawerOpen}
            onOpen={() => setDrawerOpen(true)}
            onClose={() => setDrawerOpen(false)}
        >
            <Paper>
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
            </Paper>
        </SwipeableDrawer>
    </>
};