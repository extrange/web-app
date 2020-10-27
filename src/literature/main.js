import React, {useState} from 'react'
import {HideOnScroll, StyledButton} from "../components/common";
import {AddBooks} from "./addBook";
import {ViewBooks} from "./viewBooks";
import {Networking} from "../util";
import * as Url from "./urls";
import {
    Paper,
    Tab,
    Tabs,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import styled from 'styled-components'

const LIT_APP_SECTIONS = {
    addBooks: 'addBooks',
    viewBooks: 'viewBooks'
};

const FlexDiv = styled.div`
    display: flex;
    flex-direction: row;
`

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
            <Paper>
                <List>
                    <FlexDiv>
                        <ListItem button onClick={props.returnToMainApp}>
                            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                            <ListItemText primary={'Back to Apps'}/>
                        </ListItem>
                        <ListItem>
                            <StyledButton variant={'contained'} color={'primary'}
                                          onClick={props.logout}>Logout</StyledButton>
                        </ListItem>
                    </FlexDiv>
                </List>
            </Paper>
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
        {currentApp}
    </>;
};
