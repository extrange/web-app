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
import {styled} from "@material-ui/core/styles"

const drawerWidth = 240;

const StyledPaper = styled(Paper)({
    'max-width': '80vw'
});

const StyledDrawer = styled(Drawer)(({theme}) =>
    ({
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    })
);

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