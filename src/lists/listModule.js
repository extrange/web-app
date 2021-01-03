import {useEffect, useState} from "react";
import {AppBarResponsive} from "../components/appBarResponsive";
import {Tasklists} from "./tasklists/tasklists";
import {Tasks} from "./tasks/tasks";
import {Networking} from "../util";
import {getTasksUrl, getTaskUrl, TASKLISTS_URL} from "./urls";
import {CircularProgress, IconButton, Typography} from "@material-ui/core";
import SyncIcon from '@material-ui/icons/Sync';
import {useAsyncError} from "../components/useAsyncError";

const CURRENT_LIST = 'CURRENT_LIST';

//todo move into urls as static methods
const get = Networking.crudMethods(getTasksUrl, getTaskUrl)[0];

export const ListModule = ({returnToMainApp, logout}) => {

    // There is a chance the listId stored is invalid - useEffect below checks for this
    const [currentListId, setCurrentListId] = useState(null);
    const [tasklists, setTasklists] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const setError = useAsyncError();

    const setAndSaveCurrentList = listId => {
        setCurrentListId(listId);
        localStorage.setItem(CURRENT_LIST, listId);
    };

    const listTasklists = () => Networking.send(TASKLISTS_URL, {
        method: 'GET'
    })
        .then(resp => resp.json())
        .then(json => setTasklists(json));

    //todo use Abort controller to cancel requests
    const listItems = list => {
        setLoading(true);
        get(list).then(result => {
            setLoading(false);
            setItems(result);
        }).catch(e => setError(e));
    };

    useEffect(() => void listTasklists(), []);

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
        <Typography variant={"h6"} noWrap>{getTasklistTitle(currentListId)}</Typography>
        {loading
            ? <CircularProgress color="inherit" size={20} style={{margin: '12px'}}/>
            : <IconButton onClick={() => currentListId ? listItems(currentListId) : 0}><SyncIcon/></IconButton>}
    </>;

    return <AppBarResponsive
        appName={'Lists'}
        returnToMainApp={returnToMainApp}
        logout={logout}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        titleContent={title}
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
            items={items}
            setItems={setItems}
            listItems={listItems}
        />
    </AppBarResponsive>
};
