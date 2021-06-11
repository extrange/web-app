import {useCallback, useEffect, useState} from 'react';
import {Books} from "./Books";
import * as Url from "./urls";
import {capitalize} from "lodash";
import {List, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import {AppBar} from "../../app/AppBar/AppBar";
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import TitleIcon from '@material-ui/icons/Title';
import {GenericAddDeleteCreate} from "./genericAddDeleteCreate";
import {Genres} from "./Genres";

import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

const LITERATURE_CURRENT_SUBMODULE = 'LITERATURE_CURRENT_SUBMODULE';

const LITERATURE_MODULES = (props = {}) => ({
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
        jsx: <GenericAddDeleteCreate
            types={props.authors}
            addType={Url.addAuthor}
            deleteType={Url.deleteAuthor}
            getType={props.getAuthors}
            updateType={Url.updateAuthor}
        />
    },
    GENRES: {
        appDrawer: <><ListItemIcon>
            <InsertDriveFileIcon/>
        </ListItemIcon>
            <ListItemText primary={'Genres'}/></>,
        jsx: <Genres
            books={props.books}
            genres={props.genres}
            addGenre={Url.addGenre}
            deleteGenre={Url.deleteGenre}
            getGenres={props.getGenres}
            updateGenre={Url.updateGenre}
            setTitleEndAdornment={props.setTitleEndAdornment}
        />
    },
    TYPES: {
        appDrawer: <><ListItemIcon>
            <TitleIcon/>
        </ListItemIcon>
            <ListItemText primary={'Types'}/></>,
        jsx: <GenericAddDeleteCreate
            types={props.types}
            addType={Url.addType}
            deleteType={Url.deleteType}
            getType={props.getTypes}
            updateType={Url.updateType}
        />
    }
});

export const Literature = () => {

    const storedSubModule = sessionStorage.getItem(LITERATURE_CURRENT_SUBMODULE);

    const saveCurrentSubModule = key => sessionStorage.setItem(LITERATURE_CURRENT_SUBMODULE, key);

    // Default to first module in LITERATURE_MODULES
    const [currentSubModule, setCurrentSubModule] = useState(storedSubModule ?? Object.keys(LITERATURE_MODULES())[0]);

    const [books, setBooks] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [types, setTypes] = useState([]);

    const [titleEndAdornment, setTitleEndAdornment] = useState(null)


    const getBooks = useCallback(() => Url.getBooks().then(json => setBooks(json)), []);

    const getAuthors = useCallback(() => Url.getAuthors().then(result => setAuthors(result)), []);
    const getGenres = useCallback(() => Url.getGenres().then(result => setGenres(result)), []);
    const getTypes = useCallback(() => Url.getTypes().then(result => setTypes(result)), []);

    useEffect(() => {
        void getBooks();
        void getAuthors();
        void getGenres();
        void getTypes();
    }, [getAuthors, getBooks, getGenres, getTypes]);

    const drawerContent = <List disablePadding>
        {Object.entries(LITERATURE_MODULES()).map(([key, value]) => <ListItem
            key={key}
            button
            onClick={() => {
                setCurrentSubModule(key);
                saveCurrentSubModule(key);
                setDrawerOpen(false)
            }}>
            {value.appDrawer}</ListItem>)}
    </List>;

    return (
        <AppBar
            titleContent={<>
                <Typography variant={"h6"} noWrap>
                    {capitalize(currentSubModule)}
                </Typography>
                {titleEndAdornment}
            </>}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            drawerContent={drawerContent}>
            <DndProvider backend={HTML5Backend}>
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
                    getTypes,
                    setTitleEndAdornment,
                })[currentSubModule].jsx}
            </DndProvider>
        </AppBar>
    );
};
