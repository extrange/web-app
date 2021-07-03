import { Button } from "@material-ui/core";
import CallMadeIcon from '@material-ui/icons/CallMade';
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { BackgroundScreenRounded } from "../../shared/components/backgroundScreen";
import { selectLoginStatus, setCurrentModule } from "../appSlice";
import { MODULES } from "./modules";

const GDOCS_ATTRACTIONS_URL = 'https://docs.google.com/document/d/1MS6oLLnTWWhdS_FEr1vudNfsnGBMT2V1GtrmHzDd6s0/edit#';

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
`

const ModulesContainer = styled(BackgroundScreenRounded)`
  margin: 48px 0;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledButton = styled(Button)({
    margin: '10px',
});

/*Also handles persisting of CURRENT_MODULE in localstorage and updates redux store accordingly*/
export const ModuleSelect = () => {

    const dispatch = useDispatch()
    const { isSuperUser } = useSelector(selectLoginStatus)

    const modules = Object.entries(MODULES)
        .filter(([_, { onlySuperUser }]) => isSuperUser || !onlySuperUser)
        .map(([moduleKey, { menuName }]) =>
            <StyledButton
                variant={'outlined'}
                color={'primary'}
                key={moduleKey}
                onClick={() => dispatch(setCurrentModule(moduleKey))}>
                {menuName}
            </StyledButton>
        )

    /*Todo get this URL from the server in future*/
    modules.push(isSuperUser && <StyledButton
        variant={'outlined'}
        color={'primary'}
        key={'attractions'}
        onClick={() => window.open(GDOCS_ATTRACTIONS_URL, '_blank', 'noopener,noreferrer')}
        endIcon={<CallMadeIcon />}>
        Attractions and Food
    </StyledButton>)

    return <OuterContainer>
        <ModulesContainer>
            {modules}
        </ModulesContainer>
    </OuterContainer>
};