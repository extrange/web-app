import { Button, Checkbox, CircularProgress, FormControlLabel, TextField, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { BackgroundScreenRounded } from "../../shared/components/backgroundScreen";
import { Loading } from "../../shared/components/Loading";
import { selectLoginStatus, setNetworkError } from "../appSlice";
import { NETWORK_ERROR } from "../constants";
import { showZoom } from '../starfield/Starfield';
import { useCheckLoginQuery, useLoginMutation } from "./authApi";

const StyledForm = styled.form`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 300px;
  height: 100vh;
  ${({ $blur }) => $blur && `filter: blur(5px) opacity(25%);`}
  transition: 0.5s;
  
  .grecaptcha-badge {
      width: 0 !important; //This badge keeps expanding the canvas on submit
  }
`;

const InnerContainer = styled(BackgroundScreenRounded)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  position: relative;
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

/*Will update loggedIn state
The lag on error is due to recaptcha resetting*/
export const Login = () => {

    const dispatch = useDispatch()
    const { recaptchaKey } = useSelector(selectLoginStatus)

    /* isLoading is used to determine if starfield zoom animation should be shown */
    const [login, { isLoading }] = useLoginMutation()
    const { isFetching, isError, error } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true })

    const { register, getValues, setValue } = useForm({
        defaultValues: {
            username: '',
            password: '',
            otp: null,
            save_browser: false,
        }
    })

    register('username')
    register('password')
    register('otp')
    register('save_browser')

    const recaptchaRef = React.useRef();
    const [loginMessage, setLoginMessage] = useState('Sign In');
    const [otpRequired, setOtpRequired] = useState(false);

    /* Control zoom effect on starfield here */
    useEffect(() => void (showZoom.val = isLoading), [isLoading])

    const onSubmit = useCallback(event => {
        event.preventDefault();
        console.log(getValues())

        setLoginMessage('')
        recaptchaRef.current
            .executeAsync()
            .then(token => login({
                token: token,
                ...getValues()
            }))
            .then(res => {
                /* Handle 401/403 errors here (either OTP required or wrong password) */
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
    }, [dispatch, login, getValues])

    /*Show loading screen also for non-401/403 errors*/
    if (isFetching || (isError && ![401, 403].includes(error.status)))
        return <Loading
            open={true}
            message={isError ? 'HTTP Error' : 'Checking authentication...'}
            fullscreen={true} />;

    return <>
        <StyledForm onSubmit={onSubmit} $blur={isLoading}>
            <InnerContainer>
                <Typography variant={'h6'} gutterBottom align={"center"} style={{ height: '32px' }}>
                    {loginMessage}
                </Typography>
                {!otpRequired && <>
                    <StyledTextField
                        autoComplete={'username'}
                        autoFocus
                        fullWidth
                        label={'Username'}
                        name={'username'}
                        onChange={e => setValue('username', e.target.value)}

                        required
                        type='text'
                        variant={'outlined'}
                    />

                    <StyledTextField
                        autoComplete={'current-password'}
                        fullWidth
                        label={'Password'}
                        name={'password'}
                        onChange={e => setValue('password', e.target.value)}
                        required
                        type={'password'}
                        variant={'outlined'}
                    />
                </>}

                {otpRequired && <>
                    <StyledTextField
                        autoComplete={'one-time-code'}
                        fullWidth
                        inputMode={"numeric"}
                        label={'OTP'}
                        name={'otp'}
                        onChange={e => setValue('otp', e.target.value)}
                        pattern={"[0-9]*"}
                        required
                        type={'password'}
                        variant={'outlined'}
                    />
                    <FormControlLabel
                        control={<Checkbox
                            name={'save_browser'}
                            onChange={e => setValue('save_browser', e.target.checked)}
                        />}
                        label={'Remember browser'}
                    />
                </>}
                <Button
                    variant={'contained'}
                    type={'submit'}
                    color={'primary'}
                    disabled={isLoading}
                    fullWidth>
                    <Spacer />Login{isLoading ? <StyledCircularProgress color={"inherit"} size={20} /> : <Spacer />}
                </Button>
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size={'invisible'}
                    sitekey={recaptchaKey}
                    theme={'dark'}
                />
            </InnerContainer>
        </StyledForm>
    </>;
};
