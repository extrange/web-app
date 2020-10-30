import React, {useEffect, useState} from "react";
import {Navbar} from "../components/navbar";
import {Tasklists} from "./tasklists/tasklists";
import {Tasks} from "./tasks/tasks";
import styled from "styled-components";
import {Networking} from "../util";
import {TASKLISTS_URL} from "./urls";

const StyledTasks = styled.div`
    margin: 0 auto;
    height: 100vh;
    overflow: hidden;
    display: flex;
`;

export const TaskApp = ({returnToMainApp, logout}) => {

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

    useEffect(() => {
        listTasklists()
    }, []);

    return <>
        <Navbar
            returnToMainApp={returnToMainApp}
            logout={logout}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            title={'Tasks'}>
            <Tasklists
                currentTasklist={currentTasklist}
                setCurrentTasklist={setCurrentTasklist}
                returnToMainApp={returnToMainApp}
                setDrawerOpen={setDrawerOpen}
                logout={logout}
                tasklists={tasklists}
                listTasklists={listTasklists}
            />
        </Navbar>
        <StyledTasks>

            <Tasks
                currentTasklist={currentTasklist}
            />
        </StyledTasks>
    </>;
};
