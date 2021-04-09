import React, {useState} from 'react';
import {LOGIN_URL} from "./globals/urls";
import styled from "styled-components";
import {Button, CircularProgress, TextField, Typography} from "@material-ui/core";
import {BackgroundScreenRounded} from "./shared/backgroundScreen";
import {Networking, NotAuthenticated} from "./util/networking";
import {useInput} from "./util/useInput";
import {useAsyncError} from "./util/useAsyncError";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_RECAPTCHA_KEY = "6LeqZqIaAAAAAAO03xwyC8SrpGSRWbFqD-vpMe72"

/*If this is in the class, it is redeclared on every render
In switch statements, this will cause LOGIN_STATES.AUTHENTICATED to be unequal to other instances
of itself. Declaring this once here ensures that the objects are definitely equal.*/
const LOGIN_STATES = {
    UNKNOWN: {name: 'unknown', message: 'Checking authentication...'},
    LOADING: {name: 'loading', message: <CircularProgress size={20}/>},
    FORBIDDEN: {name: 'forbidden', message: 'Invalid username/password!'},
    NOT_AUTHENTICATED: {name: 'sign_in', message: 'Sign In'},
    SERVER_ERROR: {name: 'server_error', message: 'Server Error'}
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 300px;
  height: 100vh;
`;

const InnerContainer = styled(BackgroundScreenRounded)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

const StyledTextField = styled(TextField)`
  margin: 5px 0;
`

export const Login = ({setLoggedIn}) => {

    const [loginState, setLoginState] = useState(LOGIN_STATES.NOT_AUTHENTICATED);
    const {values, bind} = useInput();
    const setError = useAsyncError();

    const recaptchaRef = React.createRef()

    const checkCaptcha = event => {
        event.preventDefault();
        recaptchaRef.current.execute()
    };

    const submit = (token) => {
        setLoginState(LOGIN_STATES.LOADING);


        Networking.send(LOGIN_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `username=${values.username}&password=${values.password}&token=${token}`,
        }).then(() => {
            //User is authenticated
            setLoggedIn(true);
        }).catch(error => {
            if (error instanceof NotAuthenticated) {
                setLoginState(LOGIN_STATES.FORBIDDEN);
            } else setError(error.message)
        });
    }


    return <StyledForm onSubmit={checkCaptcha}>
        <InnerContainer>
            <Typography variant={'h6'} gutterBottom align={"center"}>
                {loginState.message}
            </Typography>
            <StyledTextField
                type='text'
                label={'Username'}
                fullWidth
                required
                autoFocus
                variant={'outlined'}
                autoComplete={'username'}
                {...bind('username')}
            />

            <StyledTextField
                type={'password'}
                label={'Password'}
                autoComplete={'current-password'}
                fullWidth
                required
                variant={'outlined'}
                {...bind('password')}
            />

            <Button
                variant={'contained'}
                type={'submit'}
                color={'primary'}
                fullWidth
            >
                Login
            </Button>
            <ReCAPTCHA
                ref={recaptchaRef}
                size={'invisible'}
                sitekey={SITE_RECAPTCHA_KEY}
                onChange={submit}
            />

        </InnerContainer>
    </StyledForm>;
};
