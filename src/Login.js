import {useState} from 'react';
import {LOGIN_URL} from "./globals/urls";
import styled from "styled-components";
import {Button, TextField, Typography} from "@material-ui/core";
import {BackgroundScreenRounded} from "./shared/backgroundScreen";
import {Networking, NotAuthenticated} from "./util/networking";
import {useInput} from "./util/useInput";

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


    return <StyledContainer onSubmit={handleSubmit}>
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
        </InnerContainer>
    </StyledContainer>;
};
