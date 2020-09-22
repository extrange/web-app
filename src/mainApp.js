import React, {useState} from "react";
import {Tasklists} from "./tasks/tasklists/tasklists";
import {Tasks} from "./tasks/tasks/tasks";
import styled from "styled-components";
import {LitApp} from "./literature/main";
import {StyledButton} from "./components/common";

//App constants
const CURRENT_APP = 'current_app';
const TASKS_APP = 'tasks_app';
const LITERATURE_APP = 'literature_app';

//todo Move this into another class 'TaskApp' which should be the actual wrapper
const StyledTasks = styled.div`
    margin: 0 auto;
    height: 100vh;
    overflow: hidden;
    display: flex;
`;

const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 0 auto;
`;

/**
 * Allows the user to switch between apps, remembering state in localStorage.
 * Loads immediately after successful login.
 */
export const MainApp = props => {

    const [currentTasklist, setCurrentTasklist] = useState(null);
    const [currentApp, setCurrentApp] = useState(null);

    const returnToMainApp = () => {
        localStorage.removeItem(CURRENT_APP);
        setCurrentApp(null);
    };

    const tasksApp =
        <StyledTasks>
            <Tasklists
                currentTasklist={currentTasklist}
                setCurrentTasklist={setCurrentTasklist}
                returnToMainApp={returnToMainApp}
                {...props}
            />
            <Tasks
                currentTasklist={currentTasklist}
            />
        </StyledTasks>;

    const literatureApp =
        <LitApp
            returnToMainApp={returnToMainApp}
            {...props}
        />
    ;

    const checkCurrentApp = () => {
        let currApp = localStorage.getItem(CURRENT_APP);
        if (currApp) {
            setCurrentApp(currApp)
        }
    };


    const selectApp =
        <SelectContainer>

            <StyledButton
                variant={'outlined'}
                color={'primary'}
                onClick={e => {
                    localStorage.setItem(CURRENT_APP, TASKS_APP);
                    setCurrentApp(TASKS_APP)
                }}
            >Tasks App
            </StyledButton>

            <StyledButton
                variant={'outlined'}
                color={'primary'}
                onClick={e => {
                    localStorage.setItem(CURRENT_APP, LITERATURE_APP);
                    setCurrentApp(LITERATURE_APP)
                }}>Literature App
            </StyledButton>

            <StyledButton
                variant={'contained'}
                color={'primary'}
                onClick={props.logout}
            >Logout
            </StyledButton>

        </SelectContainer>;


    switch (currentApp) {
        case TASKS_APP:
            return tasksApp;
        case LITERATURE_APP:
            return literatureApp;
        default:
            checkCurrentApp();
            return selectApp
    }
};
