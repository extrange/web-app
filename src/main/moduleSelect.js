import React, {useState} from "react";
import {Networking} from "../util";
import {LOGOUT_URL} from "../urls";
import {TaskModule} from "../tasks/main";
import {Literature} from "../literature/main";
import {StyledButton} from "../components/common";
import styled from "styled-components";

// LocalStorage key
const CURRENT_MODULE= 'CURRENT_MODULE';

const modules = props => ({
    TASKS: {
        displayName: 'Lists',
        jsx: <TaskModule {...props}/>
    },
    LITERATURE: {
        displayName: 'Literature',
        jsx: <Literature {...props}/>
    },
});

const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 300px;
    margin: 0 auto;
    height: 100vh;
`;

export const ModuleSelect = ({setLoggedIn}) => {
    const [currentApp, setCurrentApp] = useState(localStorage.getItem(CURRENT_MODULE));

    const returnToMainApp = () => {
        localStorage.removeItem(CURRENT_MODULE);
        setCurrentApp(null);
    };

    const logout = () => {
        Networking
            .send(LOGOUT_URL, {method: 'POST'})
            .then(() => setLoggedIn(false));
    };

    return currentApp
            ? modules({returnToMainApp, logout})[currentApp].jsx
            : <SelectContainer>
            {
                Object.entries(modules()).map(([moduleName, value]) =>
                    <StyledButton
                        variant={'outlined'}
                        color={'primary'}
                        fullWidth
                        key={moduleName}
                        onClick={() => {
                            localStorage.setItem(CURRENT_MODULE, moduleName);
                            setCurrentApp(moduleName)
                        }}
                    >{value.displayName}</StyledButton>
                )
            }
                <StyledButton
                    variant={'contained'}
                    color={'primary'}
                    fullWidth
                    onClick={logout}
                >Logout
                </StyledButton>

            </SelectContainer>
        ;
};