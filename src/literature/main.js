import React, {useState} from 'react'
import {AddBooks} from "./addBook";
import {ViewBooks} from "./viewBooks";
import {Networking} from "../util";
import * as Url from "./urls";
import {Navbar} from "../components/navbar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const LIT_APP_SECTIONS = {
    addBooks: 'addBooks',
    viewBooks: 'viewBooks'
};

export const LitApp = ({returnToMainApp, logout, ...props}) => {
    const [books, setBooks] = useState([]);
    const [currentSection, setCurrentSection] = useState(LIT_APP_SECTIONS.addBooks);
    const [drawerOpen, setDrawerOpen] = useState(false);


    const refreshBooks = () => {
        Networking.send(Url.BOOKS, {method: 'GET'})
            .then(resp => resp.json())
            .then(json => setBooks(json));
    };

    const handleChange = value => {
        setCurrentSection(value);
        setDrawerOpen(false)
    };

    let currentApp;

    switch (currentSection) {
        case LIT_APP_SECTIONS.addBooks:
            currentApp = <AddBooks refreshBooks={refreshBooks}/>;
            break;
        case LIT_APP_SECTIONS.viewBooks:
            currentApp = <ViewBooks books={books} refreshBooks={refreshBooks}/>;
            break;
        default:
            currentApp = 'Select an option from the menu...'
    }

    return <>
        <Navbar
            title={'Literature'}
            logout={logout}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            returnToMainApp={returnToMainApp}>

            <ListItem button onClick={() => handleChange(LIT_APP_SECTIONS.addBooks)}>
                <ListItemText primary={'Add Books'}/>
            </ListItem>
            <ListItem button onClick={() => handleChange(LIT_APP_SECTIONS.viewBooks)}>
                <ListItemText primary={'View Books'}/>
            </ListItem>
        </Navbar>
        {currentApp}
    </>;
};
