import React, {useEffect, useRef, useState} from "react";
import {Navbar} from "../components/navbar";
import {Tasklists} from "./tasklists/tasklists";
import {Tasks} from "./tasks/tasks";
import styled from "styled-components";
import {Networking} from "../util";
import {TASKLISTS_URL} from "./urls";

const TaskDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 0 auto;
`

export const TaskApp = ({returnToMainApp, logout}) => {

    const [currentTasklist, setCurrentTasklist] = useState(null);
    const [tasklists, setTasklists] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const listRef = useRef()

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
            return tasklists.filter(e => e?.id === id)[0]?.title
        else return 'Tasks'
    }

    useEffect(() => {
        listTasklists()
    }, []);

    return <TaskDiv>
        <Navbar
            returnToMainApp={returnToMainApp}
            logout={logout}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            target={listRef}
            title={getTasklistTitle(currentTasklist)}>
            <Tasklists
                currentTasklist={currentTasklist}
                setCurrentTasklist={setCurrentTasklist}
                setDrawerOpen={setDrawerOpen}
                tasklists={tasklists}
                listTasklists={listTasklists}
            />
        </Navbar>
        <Tasks
            currentTasklist={currentTasklist}
        />
    </TaskDiv>;
};
