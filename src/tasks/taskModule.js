import React, {useEffect, useState} from "react";
import {AppBarResponsive} from "../components/appBarResponsive";
import {Tasklists} from "./tasklists/tasklists";
import {Tasks} from "./tasks/tasks";
import {Networking} from "../util";
import {TASKLISTS_URL} from "./urls";

export const TaskModule = ({returnToMainApp, logout}) => {

    const [currentTasklist, setCurrentTasklist] = useState(null);
    const [tasklists, setTasklists] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);


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

    return <AppBarResponsive
        returnToMainApp={returnToMainApp}
        logout={logout}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        title={getTasklistTitle(currentTasklist)}
        drawerContent={<Tasklists
            currentTasklist={currentTasklist}
            setCurrentTasklist={setCurrentTasklist}
            tasklists={tasklists}
            listTasklists={listTasklists}
            setDrawerOpen={setDrawerOpen}
        />}
    >
        <Tasks
            currentTasklist={currentTasklist}
        />
    </AppBarResponsive>
};
