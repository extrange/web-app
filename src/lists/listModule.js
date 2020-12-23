import {useEffect, useState} from "react";
import {AppBarResponsive} from "../components/appBarResponsive";
import {Tasklists} from "./tasklists/tasklists";
import {Tasks} from "./tasks/tasks";
import {Networking} from "../util";
import {TASKLISTS_URL} from "./urls";
import {CircularProgress} from "@material-ui/core";

const CURRENT_LIST = 'CURRENT_LIST';

export const ListModule = ({returnToMainApp, logout}) => {

    // There is a chance the listId stored is invalid - useEffect below checks for this
    const [currentListId, setCurrentListId] = useState(null);
    const [tasklists, setTasklists] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const setAndSaveCurrentList = listId => {
        setCurrentListId(listId);
        localStorage.setItem(CURRENT_LIST, listId);
    };

    const listTasklists = () => Networking.send(TASKLISTS_URL, {
        method: 'GET'
    })
        .then(resp => resp.json())
        .then(json => setTasklists(json));


    useEffect(() => {
        listTasklists()
    }, []);

    // Only set currentListId to saved id if valid
    useEffect(() => {
        let savedListId = localStorage.getItem(CURRENT_LIST);
        if (tasklists && tasklists.map(e => e.id).includes(savedListId)) {
            setCurrentListId(savedListId)
        }
    }, [tasklists]);


    const getTasklistTitle = listId => {
        if (listId && tasklists)
            return tasklists.find(e => e.id === listId)?.title;
    };

    const title = <>
        {getTasklistTitle(currentListId)}
        {loading && <CircularProgress color="inherit" size={20} style={{'marginLeft': '20px'}}/>}
    </>;

    return <AppBarResponsive
        appName={'Lists'}
        returnToMainApp={returnToMainApp}
        logout={logout}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        title={title}
        drawerContent={<Tasklists
            currentListId={currentListId}
            setAndSaveCurrentList={setAndSaveCurrentList}
            tasklists={tasklists}
            listTasklists={listTasklists}
            setDrawerOpen={setDrawerOpen}
        />}
    >
        <Tasks
            currentList={currentListId}
            setLoading={setLoading}
        />
    </AppBarResponsive>
};
