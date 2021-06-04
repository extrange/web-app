import React, {useState} from 'react';
import {LOGIN_URL} from "./urls";
import styled from "styled-components";
import {Button, Checkbox, CircularProgress, FormControlLabel, TextField, Typography} from "@material-ui/core";
import {BackgroundScreenRounded} from "../common/backgroundScreen";
import {Networking} from "./network/networking";
import {useInput} from "../common/useInput";
import ReCAPTCHA from "react-google-recaptcha";
import {useDispatch} from "react-redux";
import {login, setNetworkError} from "./appSlice";
import {NETWORK_ERROR} from "./network/NetworkError";

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
`;

const Spacer = styled.div`
  width: 30px
`;

const StyledCircularProgress = styled(CircularProgress)`
  margin-left: 10px;
`;

export const Login = ({recaptchaKey}) => {

    const dispatch = useDispatch()

    const [loginMessage, setLoginMessage] = useState('Sign In');
    const [loading, setLoading] = useState(false);
    const [otpRequired, setOtpRequired] = useState(false);

    const {values, bind, setValue} = useInput();
    const recaptchaRef = React.useRef();

    const onSubmit = event => {
        event.preventDefault();
        setLoading(true);
        recaptchaRef.current
            .executeAsync()
            .then(token => Networking.send(LOGIN_URL, {
                method: Networking.POST,
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                    token: token,
                    otp: values.otp,
                    save_browser: values.saveBrowser
                }),
                allowUnauth: true
            }))
            .then(r => {
                setLoading(false)
                r.json().then(json => {

                    if (r.ok) {
                        dispatch(login(json))
                        return
                    }

                    /*401/403 errors*/
                    if (json.otp_required && !otpRequired) {
                        setOtpRequired(true)

                    } else /*Invalid username/password/OTP*/
                        setLoginMessage(json.message)

                    /*Reset captcha to allow user to retry*/
                    recaptchaRef.current?.reset();
                })
            })
            .catch(e => {
                dispatch(setNetworkError({
                    message: {text: e?.toString()},
                    name: 'Fetch Error: gRecaptcha request failed',
                    type: NETWORK_ERROR.FETCH_ERROR,
                }))
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
