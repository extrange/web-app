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
import React from "react";

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
        <Drawer
            open={drawerOpen}
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
                        <ListItemText inset={true} primary={'Logout'}/>
                    </ListItem>
                </List>
            </Paper>
        </Drawer>
    </>
};