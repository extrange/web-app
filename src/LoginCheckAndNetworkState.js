import React, {useEffect, useState} from "react";
import {LOGIN_URL, LOGOUT_URL, RECAPTCHA_KEY_URL} from "./globals/urls";
import {Login} from "./Login";
import {ModuleSelect} from "./ModuleSelect";
import {Loading} from "./shared/loading";
import {NotificationProvider} from "./shared/NotificationProvider/NotificationProvider";
import {Networking} from "./util/networking";
import {useAsyncError} from "./util/useAsyncError";
import {RefreshSession} from "./RefreshSession";
import {NetworkState, NetworkStateSnackbar} from "./NetworkStateSnackbar";

/* Checks if user is logged in, as well as sets global NetworkState callbacks*/
export const LoginCheckAndNetworkState = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [networkError, setNetworkError] = useState();
    const [recaptchaKey, setRecaptchaKey] = useState('');
    const setError = useAsyncError();

    const fetchRecaptchaKey = () => void Networking.send(RECAPTCHA_KEY_URL)
        .then(r => r.json())
        .then(r => void setRecaptchaKey(r['key']));


    const logout = () => {
        localStorage.clear(); // Clear localStorage if called
        Networking
            .send(LOGOUT_URL, {method: 'POST'})
            .then(() => {
                setNetworkError(undefined);
                setLoggedIn(false);

                /*If the user refreshed the page while logged in, the recaptcha key
                * would not have been fetched*/
                if (!recaptchaKey)
                    fetchRecaptchaKey()
            })
    };


    useEffect(() => {

        /*Setup global callback to notify user of 4xx/5xx errors.*/
        NetworkState.throwError = error => setNetworkError(error);

        /*Check if user is logged in*/
        fetch(LOGIN_URL, {
            method: 'GET',
            credentials: 'include',
            headers: {Accept: 'application/json'}
        }).then(r => {
            setLoading(false);
            if (r.ok) setLoggedIn(true);
            else if ([401, 403].includes(r.status)) {
                /*User is not logged in, get reCAPTCHA key*/
                fetchRecaptchaKey()
            } else {
                /*Throw on other, non 401/403 errors*/
                setError(`HTTP Error ${r.status}: ${r.statusText}`)
            }
        })
    }, [setError]);

    if (loading || (!loggedIn && !recaptchaKey))
        return <Loading
            open={true}
            message={'Checking authentication...'}
            fullscreen={true}/>;

    if (!loggedIn)
        return <Login setLoggedIn={setLoggedIn} recaptchaKey={recaptchaKey}/>;

    /*User is authenticated*/
    return <>
        {networkError &&
        <NetworkStateSnackbar
            logout={logout}
            networkError={networkError}
            setNetworkError={setNetworkError}
        />}
        <RefreshSession/>
        <NotificationProvider>
            <ModuleSelect logout={logout}/>
        </NotificationProvider>
    </>;
};
