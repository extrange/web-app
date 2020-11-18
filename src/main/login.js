import React, {useState} from 'react'
import {Networking, NotAuthenticated, useInput} from "../util";
import {LOGIN_URL} from "../urls";
import styled from "styled-components";
import {StyledTextField} from "../components/common";
import {Button, Typography} from "@material-ui/core";

/*If this is in the class, it is redeclared on every render
In switch statements, this will cause LOGIN_STATES.AUTHENTICATED to be unequal to other instances
of itself. Declaring this once here ensures that the objects are definitely equal.*/
const LOGIN_STATES = {
    UNKNOWN: {name: 'unknown', message: 'Checking authentication...'},
    LOADING: {name: 'loading', message: 'Awaiting server reply...'},
    FORBIDDEN: {name: 'forbidden', message: 'Invalid username/password!'},
    NOT_AUTHENTICATED: {name: 'sign_in', message: 'Sign In'},
};

const StyledContainer = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    max-width: 300px;
    height: 100vh;
    padding: 0 10px;
`;

export const Login = ({setLoggedIn}) => {

    let [loginState, setLoginState] = useState(LOGIN_STATES.NOT_AUTHENTICATED);
    let {values, bind} = useInput();

    const handleSubmit = event => {
        event.preventDefault();
        setLoginState(LOGIN_STATES.LOADING);
        Networking.send(LOGIN_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `username=${values.username}&password=${values.password}`,
        }).then(() => {
            //User is authenticated
            setLoggedIn(true);
        }).catch(error => {
            if (error instanceof NotAuthenticated) {
                setLoginState(LOGIN_STATES.FORBIDDEN);
            } else throw new Error(error.message)
        });
    };


    return <StyledContainer>

        <Typography variant={'h6'} gutterBottom align={"center"}>
            {loginState.message}
        </Typography>
        <StyledTextField
            type='text'
            label={'Username'}
            fullWidth
            required
            autoFocus
            autoComplete={'username'}
            {...bind('username')}
        />

        <StyledTextField
            type={'password'}
            label={'Password'}
            autoComplete={'current-password'}
            fullWidth
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

    </StyledContainer>;
};
