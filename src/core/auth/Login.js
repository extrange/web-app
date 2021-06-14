import React, {useState} from 'react';
import styled from "styled-components";
import {Button, Checkbox, CircularProgress, FormControlLabel, TextField, Typography} from "@material-ui/core";
import {BackgroundScreenRounded} from "../../shared/components/backgroundScreen";
import {useInput} from "../../shared/useInput";
import ReCAPTCHA from "react-google-recaptcha";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginStatus, setNetworkError} from "../../app/appSlice";
import {NETWORK_ERROR} from "../../app/constants";
import {useCheckLoginQuery, useLoginMutation} from "./authApi";
import {Loading} from "../../shared/components/loading";

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

/*Will update loggedIn state*/
export const Login = () => {

    const dispatch = useDispatch()
    const {recaptchaKey} = useSelector(selectLoginStatus)

    const [login, {isLoading}] = useLoginMutation()
    const {isFetching, isError, error} = useCheckLoginQuery(undefined, {refetchOnMountOrArgChange: true})

    const {values, bind, setValue} = useInput();
    const recaptchaRef = React.useRef();
    const [loginMessage, setLoginMessage] = useState('Sign In');
    const [otpRequired, setOtpRequired] = useState(false);


    const onSubmit = event => {
        event.preventDefault();
        recaptchaRef.current
            .executeAsync()
            .then(token => login({
                username: values.username,
                password: values.password,
                token: token,
                otp: values.otp,
                save_browser: values.saveBrowser
            }))
            .then(res => {
                if (res.error &&
                    res.error.type === NETWORK_ERROR.HTTP_ERROR &&
                    [401, 403].includes(res.error.status)) {
                    let data = res.error.data

                    if (data.otp_required)
                        setOtpRequired(true)

                    setLoginMessage(data.message)

                    /*Reset captcha for retries*/
                    recaptchaRef.current?.reset();
                }
            })
            .catch(e => {
                /*Since thunks do not throw if not unwrapped,
                * only gRecaptcha errors are caught here.
                * networkErrorMiddleware handles the rest.
                * This is at the end of the chain so that all
                * prior 'then's do not execute if recaptcha validation fails.*/
                dispatch(setNetworkError({
                    text: `gRecaptcha request failed: ${e?.message}`,
                    type: NETWORK_ERROR.FETCH_ERROR,
                }))
            })

    };

    /*Show loading screen also for non-401/403 errors*/
    if (isFetching || (isError && ![401, 403].includes(error.status)))
        return <Loading
            open={true}
            message={isError ? 'HTTP Error' : 'Checking authentication...'}
            fullscreen={true}/>;

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
                    inputMode={"numeric"}
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
                <Spacer/>Login{isLoading ? <StyledCircularProgress color={"inherit"} size={20}/> : <Spacer/>}
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
