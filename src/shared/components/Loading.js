import {styled as muiStyled} from "@material-ui/core/styles";
import {Backdrop, CircularProgress, Typography} from "@material-ui/core";
import styled from "styled-components";
import {BackgroundScreen} from "./backgroundScreen";

const StyledBackdrop = muiStyled(Backdrop)(({theme}) => ({
    // To cover the app drawer
    zIndex: theme.zIndex.drawer + 1,
}));

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100px;
`;

const FlexBackgroundScreen = styled(BackgroundScreen)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

/**
 * A fullscreen loading backdrop element
 * @param open
 * @param message
 * @param showSpinner
 * @param fullscreen
 * @returns {JSX.Element}
 * @constructor
 */
export const Loading = ({
                            open = true,
                            message = 'Loading...',
                            showSpinner = true,
                            fullscreen = true
                        }) => {

    let content = <FlexContainer>
        {showSpinner ? <CircularProgress color="inherit" size={30}/> : null}
        <Typography variant={'body1'} display={"block"} style={{whiteSpace: 'pre-line', textAlign: 'center'}}>{message}</Typography>
    </FlexContainer>;

    if (!open) return null;

    return fullscreen ?
        <StyledBackdrop open={open}>
            {content}
        </StyledBackdrop>
        : <FlexBackgroundScreen>
            {content}
        </FlexBackgroundScreen>;

};