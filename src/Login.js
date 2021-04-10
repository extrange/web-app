import React, {useState} from 'react';
import {LOGIN_URL} from "./globals/urls";
import styled from "styled-components";
import {Button, CircularProgress, TextField, Typography} from "@material-ui/core";
import {BackgroundScreenRounded} from "./shared/backgroundScreen";
import {Networking} from "./util/networking";
import {useInput} from "./util/useInput";
import {useAsyncError} from "./util/useAsyncError";
import ReCAPTCHA from "react-google-recaptcha";

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

const Spacer = styled.div`
  width: 30px
`

const StyledCircularProgress = styled(CircularProgress)`
  margin-left: 10px;
`

export const Login = ({setLoggedIn, recaptchaKey}) => {

    const [loginMessage, setLoginMessage] = useState('Sign In');
    const [loading, setLoading] = useState(false)

    const {values, bind} = useInput();
    const setError = useAsyncError();
    const recaptchaRef = React.useRef()


    const checkCaptcha = event => {
        setLoading(true)
        event.preventDefault();
        recaptchaRef.current
            .executeAsync()
            .then(token => fetch(LOGIN_URL, {
                method: Networking.POST,
                credentials: 'include',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `username=${values.username}&password=${values.password}&token=${token}`
            }))
            .then(r => {
                if (r.ok) {
                    setLoggedIn(true)
                } else {
                    if ([401, 403].includes(r.status)) {

                        /*Authentication error. Reset captcha to allow user to retry*/
                        r.json().then(s => setLoginMessage(s.message))
                        recaptchaRef.current.reset()
                        setLoading(false)
                    } else {

                        /*Throw on other, non 401/403 errors*/
                        setError(`HTTP Error ${r.status}: ${r.statusText}`)
                    }
                }
            })
    };
    return <StyledForm onSubmit={checkCaptcha}>
        <InnerContainer>
            <Typography variant={'h6'} gutterBottom align={"center"}>
                {loginMessage}
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
                <Spacer/>
                Login
                {loading ? <StyledCircularProgress color={"inherit"} size={20}/> : <Spacer/>}
            </Button>
            <ReCAPTCHA
                ref={recaptchaRef}
                size={'invisible'}
                sitekey={recaptchaKey}
                theme={'dark'}
            />

        </InnerContainer>
    </StyledForm>;
};
