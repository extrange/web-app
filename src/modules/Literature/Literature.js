import { IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import SyncIcon from '@material-ui/icons/Sync';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAuthorsQuery, useGetBooksQuery, useGetGenresQuery, useGetTypesQuery } from "./literatureApi";
import { selectLiteratureSubmodule, setLiteratureSubmodule } from "./literatureSlice";
import { submodules } from './submodules';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const Literature = ({ setDrawerContent, setTitleContent }) => {

    const { refetch: refetchBooks, isFetching: isFetchingBooks } = useGetBooksQuery()
    const { refetch: refetchAuthors, isFetching: isFetchingAuthors } = useGetAuthorsQuery()
    const { refetch: refetchGenres, isFetching: isFetchingGenres } = useGetGenresQuery()
    const { refetch: refetchTypes, isFetching: isFetchingTypes } = useGetTypesQuery()

    const isFetching = isFetchingBooks || isFetchingAuthors || isFetchingGenres || isFetchingTypes

    const dispatch = useDispatch()
    const literatureSubmodule = useSelector(selectLiteratureSubmodule) || Object.keys(submodules)[0]

    /* Used by Genres to display genre rules */
    const [titleEndAdornment, setTitleEndAdornment] = useState(null)

    useEffect(() => {
        setDrawerContent(<List disablePadding>
            {
                Object.entries(submodules)
                    .map(([key, { Icon, name }]) =>
                        <ListItem
                            key={key}
                            button
                            onClick={() => dispatch(setLiteratureSubmodule(key))}>
                            <ListItemIcon>
                                <Icon />
                            </ListItemIcon>
                            <ListItemText primary={name} />
                        </ListItem>)
            }
        </List>)
    }, [dispatch, setDrawerContent])

    useEffect(() => {
        setTitleContent(<>
            <Typography variant={"h6"}>
                {submodules[literatureSubmodule].name}
            </Typography>
            <IconButton
                onClick={() => {
                    refetchBooks()
                    refetchAuthors()
                    refetchGenres()
                    refetchTypes()
                }}
                disabled={isFetching}>
                <SyncIcon />
            </IconButton>
            {titleEndAdornment}
        </>)
    }, [isFetching, literatureSubmodule, refetchAuthors, refetchBooks, refetchGenres, refetchTypes, setTitleContent, titleEndAdornment])

    const { jsx, props } = submodules[literatureSubmodule]


    /* NOTE: Required versions as follows:
    - "react-dnd-html5-backend": "^11.1.3",
    - "react-dnd": "^11.1.3", 
    Provider should appear above Mui-Datatable component, so that it doesn't try to
    add another DndProvider and cause the 'Cannot have 2 HTML5 backends...' error*/
    return <DndProvider backend={HTML5Backend}>
        {React.createElement(jsx, { setTitleEndAdornment, ...props })}
    </DndProvider >
};
