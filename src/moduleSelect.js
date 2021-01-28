import {useState} from "react";
import {Networking} from "./util";
import {LOGOUT_URL} from "./urls";
import {ListModule} from "./lists/listModule";
import {LiteratureModule} from "./literature/literatureModule";
import {StyledButton} from "./components/common";
import styled from "styled-components";
import {BackgroundScreenRounded} from "./components/backgroundScreen";

const GDOCS_ATTRACTIONS_URL = 'https://docs.google.com/document/d/1MS6oLLnTWWhdS_FEr1vudNfsnGBMT2V1GtrmHzDd6s0/edit#'

/*LocalStorage key*/
const CURRENT_MODULE = 'CURRENT_MODULE';

/*Add new modules here*/
const modules = props => ({
    TASKS: {
        displayName: 'Lists',
        jsx: <ListModule {...props}/>
    },
    LITERATURE: {
        displayName: 'Literature',
        jsx: <LiteratureModule {...props}/>
    },
});

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  margin: 0 auto;
  max-width: 300px;
`;

const InnerContainer = styled(BackgroundScreenRounded)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;


export const ModuleSelect = ({setLoggedIn}) => {
    const [currentModule, setCurrentModule] = useState(localStorage.getItem(CURRENT_MODULE));

    const returnToMainApp = () => {
        localStorage.removeItem(CURRENT_MODULE);
        setCurrentModule(null);
    };

    const logout = () => {
        /*Todo optionally display a loading element*/
        Networking
            .send(LOGOUT_URL, {method: 'POST'})
            .then(() => setLoggedIn(false));
    };

    return currentModule
        ? modules({returnToMainApp, logout})[currentModule].jsx
        : <FlexContainer>
            <InnerContainer>
                {
                    Object.entries(modules()).map(([moduleName, value]) =>
                        <StyledButton
                            variant={'outlined'}
                            color={'primary'}
                            key={moduleName}
                            onClick={() => {
                                localStorage.setItem(CURRENT_MODULE, moduleName);
                                setCurrentModule(moduleName)
                            }}
                        >{value.displayName}</StyledButton>
                    )
                }
                <StyledButton
                    variant={'outlined'}
                    color={'primary'}
                    onClick={() => window.open(GDOCS_ATTRACTIONS_URL, '_blank')}>
                    Attractions and Food
                </StyledButton>
                <StyledButton
                    variant={'contained'}
                    color={'primary'}
                    onClick={logout}>
                    Logout
                </StyledButton>
            </InnerContainer>
        </FlexContainer>;
};