import React, {useEffect, useState} from 'react'
import {Networking, NotAuthenticated, useInput} from "./util";
import {LOGIN_URL, LOGOUT_URL} from "./constants";
import {MainApp} from "./mainApp";
import styled from "styled-components";
import {StyledTextField} from "./components/common";
import {Button} from "@material-ui/core";

// If this is in the class, it is redeclared on every render
// In switch statements, this will cause LOGIN_STATES.AUTHENTICATED to be unequal to other instances
// of itself. Declaring this once here ensures that the objects are definitely equal.
const LOGIN_STATES = {
    UNKNOWN: {name: 'unknown', message: 'Checking authentication...'},
    LOADING: {name: 'loading', message: 'Awaiting server reply...'},
    FORBIDDEN: {name: 'forbidden', message: 'Invalid username/password!'},
    AUTHENTICATED: {name: 'authenticated', message: 'Authenticated'},
    SIGN_IN: {name: 'sign_in', message: 'Sign In'}
};

const StyledLogin = styled.form`
    margin: 0 auto;
    max-width: 300px;
`;

const StyledCentralContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const Login = props => {

    let [loginState, setLoginState] = useState(LOGIN_STATES.UNKNOWN);
    let {values, bind} = useInput();

    const handleSubmit = event => {
        event.preventDefault();
        setLoginState(LOGIN_STATES.LOADING);
        Networking.send(LOGIN_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `username=${values.username}&password=${values.password}`,
        }).then(resp => {
            //User is authenticated, consume json
            setLoginState(LOGIN_STATES.AUTHENTICATED);
        }).catch(error => {
            if (error instanceof NotAuthenticated) { //todo start using errorBoundaries
                setLoginState(LOGIN_STATES.FORBIDDEN);
            } else throw new Error(error.message)
        });
    };

    let loginForm = () =>
        <StyledLogin className='login'>
            <p>{loginState.message}</p>
            <StyledCentralContainer>
                <StyledTextField
                    type='text'
                    label={'Username'}
                    required
                    autoFocus
                    autoComplete={'username'}
                    {...bind('username')}
                />

                <StyledTextField
                    type={'password'}
                    label={'Password'}
                    autoComplete={'current-password'}
                    required
                    {...bind('password')}
                />

                <Button
                    variant={'contained'}
                    onClick={handleSubmit}
                    color={'primary'}
                    fullWidth
                >Login
                </Button>
            </StyledCentralContainer>

        </StyledLogin>
    ;

    //Quick check if user is logged in
    let checkIfLoggedIn = () => {
        Networking.send(LOGIN_URL, {
            method: 'GET'
        }).then(resp => {
            setLoginState(LOGIN_STATES.AUTHENTICATED);
        }).catch(error => {
            if (error instanceof NotAuthenticated) {
                setLoginState(LOGIN_STATES.SIGN_IN)
            }
        })
    };

    const logout = () => {
        Networking.send(LOGOUT_URL, {method: 'POST'})
            .then(resp => setLoginState(LOGIN_STATES.SIGN_IN));
    };

    //Run once on mounting component
    useEffect(checkIfLoggedIn, []);

    if (loginState === LOGIN_STATES.AUTHENTICATED) {
        return <MainApp logout={logout}/>;
    } else {
        return loginForm();
    }
};
