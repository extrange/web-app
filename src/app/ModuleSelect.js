import {Lists} from "../modules/Lists/Lists";
import {Literature} from "../modules/Literature/Literature";
import {StyledButton} from "../common/common";
import styled from "styled-components";
import {BackgroundScreenRounded} from "../common/backgroundScreen";
import CallMadeIcon from '@material-ui/icons/CallMade';
import {HomeAutomation} from "../modules/HomeAutomation/HomeAutomation";
import {DVR} from "../modules/Dvr/DVR";
import {OptionHedgeCalculator} from "../modules/OptionHedgeCalculator/OptionHedgeCalculator";
import {PasswordTools} from '../modules/PasswordTools/PasswordTools'
import {Account} from "../modules/Account/Account";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectCurrentModule, selectLoginStatus, setCurrentModule} from "./appSlice";

const GDOCS_ATTRACTIONS_URL = 'https://docs.google.com/document/d/1MS6oLLnTWWhdS_FEr1vudNfsnGBMT2V1GtrmHzDd6s0/edit#';

/*Add new modules here*/
export const MODULES = {
    LISTS: {
        displayName: 'Lists',
        onlySuperUser: false,
        jsx: <Lists/>
    },
    LITERATURE: {
        displayName: 'Literature',
        onlySuperUser: false,
        jsx: <Literature/>
    },
    ACCOUNT: {
        displayName: 'Account',
        onlySuperUser: false,
        jsx: <Account/>
    },
    PASSWORDS: {
        displayName: 'Password Tools',
        onlySuperUser: false,
        jsx: <PasswordTools/>
    },
    HOME_AUTOMATION: {
        displayName: 'Home Automation',
        onlySuperUser: true,
        jsx: <HomeAutomation/>
    },
    DVR: {
        displayName: 'DVR',
        onlySuperUser: true,
        jsx: <DVR/>
    },
    OPTION_HEDGE_CALCULATOR: {
        displayName: 'Option Hedge Calculator',
        onlySuperUser: false,
        jsx: <OptionHedgeCalculator/>
    },
}

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


export const ModuleSelect = () => {
    const currentModule = useSelector(selectCurrentModule)
    const {isSuperUser} = useSelector(selectLoginStatus)
    const dispatch = useDispatch()

    return currentModule in MODULES ?
        MODULES[currentModule].jsx :
        <FlexContainer>
            <InnerContainer>
                {
                    Object.entries(MODULES)
                        .filter(([key, value]) => value.onlySuperUser ? isSuperUser : true)
                        .map(([key, value]) =>
                            <StyledButton
                                variant={'outlined'}
                                color={'primary'}
                                key={key}
                                onClick={() => dispatch(setCurrentModule(key))}>
                                {value.displayName}
                            </StyledButton>
                        )
                }
                {isSuperUser && <StyledButton
                    variant={'outlined'}
                    color={'primary'}
                    onClick={() => window.open(GDOCS_ATTRACTIONS_URL, '_blank', 'noopener,noreferrer')}
                    endIcon={<CallMadeIcon/>}>
                    Attractions and Food
                </StyledButton>}
                <StyledButton
                    variant={'contained'}
                    color={'primary'}
                    onClick={() => dispatch(logout())}>
                    Logout
                </StyledButton>
            </InnerContainer>
        </FlexContainer>;
};