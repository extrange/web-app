import {useEffect, useState} from "react";
import {AppBar} from "../../app/app-bar/AppBar";
import {Tasklists} from "./tasklists";
import {Tasks} from "./tasks";
import {getTasksUrl, getTaskUrl, TASKLISTS_URL} from "./urls";
import {CircularProgress, IconButton, Typography} from "@material-ui/core";
import SyncIcon from '@material-ui/icons/Sync';
import {useAsyncError} from "../../shared/useAsyncError";
import {crudMethods, send} from "../../app/appSlice";
import {useSend} from "../../shared/useSend";

const LIST_CURRENT_LIST = 'LIST_CURRENT_LIST';

//todo move into urls as static methods
const get = crudMethods(getTasksUrl, getTaskUrl)[0];

export const Lists = () => {

    // There is a chance the listId stored is invalid - useEffect below checks for this
    const [currentListId, setCurrentListId] = useState(null);
    const [tasklists, setTasklists] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const setError = useAsyncError();
    const send = useSend()

    const setAndSaveCurrentList = listId => {
        setCurrentListId(listId);
        localStorage.setItem(LIST_CURRENT_LIST, listId);
    };

    const listTasklists = () => send(TASKLISTS_URL)
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
        let savedListId = localStorage.getItem(LIST_CURRENT_LIST);
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
            ? <CircularProgress size={20} style={{margin: '12px'}}/>
            : <IconButton onClick={() => currentListId ? listItems(currentListId) : 0}><SyncIcon/></IconButton>}
    </>;

    return <AppBar
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        titleContent={title}
        drawerContent={<Tasklists
            currentListId={currentListId}
            setAndSaveCurrentList={setAndSaveCurrentList}
            tasklists={tasklists}
            listTasklists={listTasklists}
            setDrawerOpen={setDrawerOpen}/>}>
        <Tasks
            currentList={currentListId}
            setLoading={setLoading}
            items={items}
            setItems={setItems}
            listItems={listItems}
        />
    </AppBar>
};
