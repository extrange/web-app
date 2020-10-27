import React, {useState} from "react";
import styled from "styled-components";
import {LitApp} from "./literature/main";
import {StyledButton} from "./components/common";
import {TaskApp} from "./tasks/main";

//App constants
const CURRENT_APP = 'current_app';
const TASKS_APP = 'tasks_app';
const LITERATURE_APP = 'literature_app';

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
export const MainApp = ({logout}) => {

    const [currentApp, setCurrentApp] = useState(null);

    const returnToMainApp = () => {
        localStorage.removeItem(CURRENT_APP);
        setCurrentApp(null);
    };

    const tasksApp =
        <TaskApp
            returnToMainApp={returnToMainApp}
            logout={logout}
        />;

    const literatureApp =
        <LitApp
            returnToMainApp={returnToMainApp}
            logout={logout}
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
                onClick={logout}
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
