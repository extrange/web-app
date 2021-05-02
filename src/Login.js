import React, {useState} from 'react';
import {LOGIN_URL} from "./globals/urls";
import styled from "styled-components";
import {Button, Checkbox, CircularProgress, FormControlLabel, TextField, Typography} from "@material-ui/core";
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
    const [otpRequired, setOtpRequired] = useState(false)

    const {values, bind, setValue} = useInput();
    const setError = useAsyncError();
    const recaptchaRef = React.useRef()


    const onSubmit = event => {
        setLoading(true)
        event.preventDefault();
        recaptchaRef.current
            .executeAsync()
            .then(token => fetch(LOGIN_URL, {
                method: Networking.POST,
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                    token: token,
                    otp: values.otp,
                    save_browser: values.saveBrowser
                })
            }))
            .then(r => {
                if (r.ok) setLoggedIn(true)
                else if (![401, 403].includes(r.status)) {
                    /*Throw on other, non 401/403 errors*/
                    setError(`HTTP Error ${r.status}: ${r.statusText}`)
                }
                return r.json()
            })
            .then(r => {
                /*401/403 errors*/
                if (r.otp_required && !otpRequired) {
                    /*Prompt for OTP*/
                    setOtpRequired(true)
                } else {
                    /*Invalid OTP*/
                    setLoginMessage(r.message)
                }
                /*Reset captcha to allow user to retry*/
                recaptchaRef.current?.reset()
                setLoading(false)
            })
    };
    return <StyledForm onSubmit={onSubmit}>
        <InnerContainer>
            <Typography variant={'h6'} gutterBottom align={"center"}>
                {loginMessage}
            </Typography>
            {!otpRequired && <>
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
            </>}

            {otpRequired && <>
                <StyledTextField
                    type={'password'}
                    label={'OTP'}
                    autoComplete={'one-time-code'}
                    fullWidth
                    variant={'outlined'}
                    inputmode={"numeric"}
                    pattern={"[0-9]*"}
                    {...bind('otp')}
                />
                <FormControlLabel
                    control={<Checkbox
                        checked={values.saveBrowser}
                        onChange={e => setValue({
                            name: 'saveBrowser',
                            value: e.target.checked
                        })}
                    />}
                    label={'Remember browser'}
                />
            </>}

            <Button
                variant={'contained'}
                type={'submit'}
                color={'primary'}
                fullWidth
            >
                <Spacer/>Login{loading ? <StyledCircularProgress color={"inherit"} size={20}/> : <Spacer/>}
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
