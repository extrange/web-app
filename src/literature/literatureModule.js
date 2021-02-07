import {useEffect, useState} from 'react';
import {Books} from "./books";
import {Networking} from "../util";
import * as Url from "./urls";
import {List, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import {AppBarResponsive} from "../components/appBarResponsive";
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import TitleIcon from '@material-ui/icons/Title';

const LITERATURE_MODULES = props => ({
    BOOKS: {
        appDrawer: <><ListItemIcon>
            <HomeIcon/>
        </ListItemIcon>
            <ListItemText primary={'Books'}/>
        </>,
        jsx: <Books {...props}/>
    },
    AUTHORS: {
        appDrawer: <><ListItemIcon>
            <PeopleIcon/>
        </ListItemIcon>
            <ListItemText primary={'Authors'}/></>,
        jsx: 'Authors Placeholder'
    },
    GENRES: {
        appDrawer: <><ListItemIcon>
            <InsertDriveFileIcon/>
        </ListItemIcon>
            <ListItemText primary={'Genres'}/></>,
        jsx: 'Genres Placeholder'
    },
    TYPES: {
        appDrawer: <><ListItemIcon>
            <TitleIcon/>
        </ListItemIcon>
            <ListItemText primary={'Types'}/></>,
        jsx: 'Types Placeholder'
    }
})

export const LiteratureModule = ({returnToMainApp, logout}) => {

    // Default to first module in LITERATURE_MODULES
    const [currentSubModule, setCurrentSubModule] = useState(Object.entries(LITERATURE_MODULES())[0][0])

    const [books, setBooks] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [types, setTypes] = useState([]);

    const getBooks = () => Networking.send(Url.BOOKS, {method: 'GET'})
        .then(resp => resp.json())
        .then(json => setBooks(json));

    const getAuthors = () => Url.getAuthors().then(result => setAuthors(result))
    const getGenres = () => Url.getGenres().then(result => setGenres(result));
    const getTypes = () => Url.getTypes().then(result => setTypes(result));

    useEffect(() => {
        getBooks();
        getAuthors();
        getGenres();
        getTypes();
    }, []);

    const drawerContent = <List disablePadding dense>
        {Object.entries(LITERATURE_MODULES()).map(([key, value]) => <ListItem
            button
            onClick={() => setCurrentSubModule(key)}>
            {value.appDrawer}</ListItem>)}
    </List>

    return (
        <AppBarResponsive
            appName={'Literature'}
            titleContent={<Typography variant={"h6"} noWrap>
                Literature
            </Typography>}
            logout={logout}
            returnToMainApp={returnToMainApp}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            drawerContent={drawerContent}>
            {LITERATURE_MODULES({
                getBooks,
                books,
                setBooks,
                authors,
                setAuthors,
                genres,
                setGenres,
                types,
                setTypes,
                getAuthors,
                getGenres,
                getTypes
            })[currentSubModule].jsx}
        </AppBarResponsive>
    );
};
