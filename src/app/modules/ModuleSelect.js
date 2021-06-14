import styled from "styled-components";
import {BackgroundScreenRounded} from "../../shared/components/backgroundScreen";
import CallMadeIcon from '@material-ui/icons/CallMade';
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentModule, selectLoginStatus, setCurrentModule} from "../appSlice";
import {MODULES} from "./modules";
import {Button} from "@material-ui/core";
import {useLogoutMutation} from "../../core/auth/authApi";

const GDOCS_ATTRACTIONS_URL = 'https://docs.google.com/document/d/1MS6oLLnTWWhdS_FEr1vudNfsnGBMT2V1GtrmHzDd6s0/edit#';

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

const StyledButton = styled(Button)({
    margin: '10px',
});


export const ModuleSelect = () => {
    const dispatch = useDispatch()
    const [logout] = useLogoutMutation()

    const {id: moduleId, meta} = useSelector(selectCurrentModule)
    const {isSuperUser} = useSelector(selectLoginStatus)

    return moduleId in MODULES ?
        MODULES[moduleId].jsx :
        <FlexContainer>
            <InnerContainer>
                {
                    Object.entries(MODULES)
                        .filter(([id, value]) => value.onlySuperUser ? isSuperUser : true)
                        .map(([id, value]) =>
                            <StyledButton
                                variant={'outlined'}
                                color={'primary'}
                                key={id}
                                onClick={() => dispatch(setCurrentModule({id, title: value.displayName}))}>
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
                    onClick={() => logout()}>
                    Logout
                </StyledButton>
            </InnerContainer>
        </FlexContainer>;
};