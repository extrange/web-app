import React, {useEffect, useState} from "react";
import {Networking, NotAuthenticated, ServerError} from "../util";
import {LOGIN_URL} from "../urls";
import {Login} from "./login";
import {Backdrop, CircularProgress, Typography} from "@material-ui/core";
import {styled as muiStyled} from '@material-ui/core/styles';
import {flowRight} from 'lodash'
import styled from 'styled-components'
import {ModuleSelect} from "./moduleSelect";

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

const withLoginCheck = Component => ({loggedIn, ...props}) => {
    return loggedIn
        ? <Component {...props}/>
        : <Login {...props}/>
};

const withLoading = Component => ({loading, ...props}) => {
    return loading
        ? <StyledBackdrop open={loading}>
            <LoadingContainer>
                <CircularProgress color="inherit" size={20}/>
                <Typography variant={'body1'} display={"block"}>Checking authentication...</Typography>
            </LoadingContainer>
        </StyledBackdrop>
        : <Component {...props} />
};

const LoginCheckWithLoginLoading =
    flowRight([
        withLoading,
        withLoginCheck,
    ])(ModuleSelect);

export const LoginCheck = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkIfLoggedIn = () => {
        setLoading(true);
        Networking
            .send(LOGIN_URL, {method: 'GET'})
            .then(() => {
                setLoggedIn(true);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                if (error instanceof NotAuthenticated) {
                    setLoggedIn(false)
                } else {
                    throw new ServerError(error.message)
                }
            })
    };

    useEffect(checkIfLoggedIn, []);

    return <LoginCheckWithLoginLoading
        loggedIn={loggedIn}
        loading={loading}
        setLoggedIn={setLoggedIn}
    />;
};
