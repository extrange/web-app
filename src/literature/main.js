import React, {useState} from 'react'
import {HideOnScroll, StyledButton} from "../components/common";
import {AddBooks} from "./addBook";
import {ViewBooks} from "./viewBooks";
import {Networking} from "../util";
import * as Url from "./urls";
import {Paper, Tab, Tabs, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu'

const LIT_APP_SECTIONS = {
    addBooks: 'addBooks',
    viewBooks: 'viewBooks'
};

export const LitApp = (props) => {
    const [books, setBooks] = useState([]);
    const [tabValue, setTabValue] = useState(LIT_APP_SECTIONS.addBooks);
    const [drawerState, setDrawerState] = useState(false)

    const refreshBooks = () => {
        Networking.send(Url.BOOKS, {method: 'GET'})
            .then(resp => resp.json())
            .then(json => setBooks(json));
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    let currentApp;

    switch (tabValue) {
        case LIT_APP_SECTIONS.addBooks:
            currentApp = <AddBooks refreshBooks={refreshBooks}/>;
            break;
        case LIT_APP_SECTIONS.viewBooks:
            currentApp = <ViewBooks books={books} refreshBooks={refreshBooks}/>;
            break;
        default:
            currentApp = 'Select a tab'
    }

    return <>
        <HideOnScroll>
            <AppBar position={'sticky'}>
                <Toolbar variant={'dense'}>
                    <IconButton color={"inherit"} onClick={() => setDrawerState(true)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant={'h6'}>
                        Literature
                    </Typography>
                </Toolbar>
            </AppBar>
        </HideOnScroll>
        <Drawer
            open={drawerState}
            onClose={() => setDrawerState(false)}
        >
            <List>
                <ListItem>
                    <ListItemText primary={'Logout'}/>
                    <ListItemIcon><MenuIcon/> </ListItemIcon>
                </ListItem>
            </List>
        </Drawer>

        <Paper>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                indicatorColor={'primary'}
                textColor={'primary'}
            >
                <Tab label={'Add Books'} value={LIT_APP_SECTIONS.addBooks}/>
                <Tab label={'Book List'} value={LIT_APP_SECTIONS.viewBooks}/>
            </Tabs>
        </Paper>
        <StyledButton variant={'outlined'} color={'primary'} onClick={props.returnToMainApp}>Return to Main
            App</StyledButton>
        <StyledButton variant={'contained'} color={'primary'} onClick={props.logout}>Logout</StyledButton>
        {currentApp}
    </>;
};
