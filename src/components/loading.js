import {styled as muiStyled} from "@material-ui/core/styles";
import {Backdrop, CircularProgress, Typography} from "@material-ui/core";
import styled from "styled-components";
import React from "react";

const StyledBackdrop = muiStyled(Backdrop)(({theme}) => ({
    zIndex: theme.zIndex.drawer + 1,
}));

const LoadingContainer = styled.div`
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 100px;
`;

/**
 * A fullscreen loading backdrop element
 * @param open
 * @param message
 * @returns {JSX.Element}
 * @constructor
 */
export const Loading = ({open, message = 'Loading...'}) =>
    <StyledBackdrop open={open}>
        <LoadingContainer>
            <CircularProgress color="inherit" size={20}/>
            <Typography variant={'body1'} display={"block"}>{message}</Typography>
        </LoadingContainer>
    </StyledBackdrop>
