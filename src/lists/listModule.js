import {useEffect, useState} from "react";
import {AppBarResponsive} from "../components/appBarResponsive";
import {Tasklists} from "./tasklists/tasklists";
import {Tasks} from "./tasks/tasks";
import {Networking} from "../util";
import {TASKLISTS_URL} from "./urls";
import {CircularProgress} from "@material-ui/core";

export const ListModule = ({returnToMainApp, logout}) => {

    const [currentList, setCurrentList] = useState(null);
    const [tasklists, setTasklists] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const listTasklists = () => {
        Networking.send(TASKLISTS_URL, {
            method: 'GET'
        })
            .then(resp => resp.json())
            .then(json => setTasklists(json))
        ;
    };

    const getTasklistTitle = id => {
        if (id && tasklists)
            return tasklists.filter(e => e?.id === id)[0]?.title;
        else return 'Tasks'
    };

    useEffect(() => {
        listTasklists()
    }, []);

    const title = <>
        {getTasklistTitle(currentList)}
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
            currentList={currentList}
            setCurrentList={setCurrentList}
            tasklists={tasklists}
            listTasklists={listTasklists}
            setDrawerOpen={setDrawerOpen}
        />}
    >
        <Tasks
            currentList={currentList}
            setLoading={setLoading}
        />
    </AppBarResponsive>
};
