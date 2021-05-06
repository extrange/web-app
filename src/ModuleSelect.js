import {useState} from "react";
import {Lists} from "./modules/Lists/Lists";
import {Literature} from "./modules/Literature/Literature";
import {StyledButton} from "./shared/common";
import styled from "styled-components";
import {BackgroundScreenRounded} from "./shared/backgroundScreen";
import CallMadeIcon from '@material-ui/icons/CallMade';
import {HomeAutomation} from "./modules/HomeAutomation/HomeAutomation";
import {DVR} from "./modules/Dvr/DVR";
import {OptionHedgeCalculator} from "./modules/OptionHedgeCalculator/OptionHedgeCalculator";
import {PasswordTools} from './modules/PasswordTools/PasswordTools'
import {Account} from "./modules/Account/Account";

const GDOCS_ATTRACTIONS_URL = 'https://docs.google.com/document/d/1MS6oLLnTWWhdS_FEr1vudNfsnGBMT2V1GtrmHzDd6s0/edit#'

/*LocalStorage key*/
const CURRENT_MODULE = 'CURRENT_MODULE';

/*Add new modules here*/
const modules = props => ({
    LISTS: {
        displayName: 'Lists',
        jsx: <Lists {...props}/>
    },
    LITERATURE: {
        displayName: 'Literature',
        jsx: <Literature {...props}/>
    },
    ACCOUNT: {
        displayName: 'Account',
        jsx: <Account {...props}/>
    },
    PASSWORDS: {
        displayName: 'Password Tools',
        jsx: <PasswordTools {...props}/>
    },
    HOME_AUTOMATION: {
        displayName: 'Home Automation',
        jsx: <HomeAutomation {...props}/>
    },
    DVR: {
        displayName: 'DVR',
        jsx: <DVR {...props}/>
    },
    OPTION_HEDGE_CALCULATOR: {
        displayName: 'Option Hedge Calculator',
        jsx: <OptionHedgeCalculator {...props}/>
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


export const ModuleSelect = ({logout}) => {
    const [currentModule, setCurrentModule] = useState(localStorage.getItem(CURRENT_MODULE));

    const returnToMainApp = () => {
        localStorage.removeItem(CURRENT_MODULE);
        setCurrentModule(null);
    };

    return currentModule in modules()
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
                {<StyledButton
                    variant={'outlined'}
                    color={'primary'}
                    onClick={() => window.open(GDOCS_ATTRACTIONS_URL, '_blank', 'noopener,noreferrer')}
                    endIcon={<CallMadeIcon/>}>
                    Attractions and Food
                </StyledButton>}
                <StyledButton
                    variant={'contained'}
                    color={'primary'}
                    onClick={logout}>
                    Logout
                </StyledButton>
            </InnerContainer>
        </FlexContainer>;
};