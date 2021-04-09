import React, {useEffect, useState} from "react";
import {LOGIN_URL} from "./globals/urls";
import {Login} from "./Login";
import {ModuleSelect} from "./ModuleSelect";
import {Loading} from "./shared/loading";
import {NotificationProvider} from "./shared/NotificationProvider/NotificationProvider";
import {Networking, NotAuthenticated} from "./util/networking";
import {useAsyncError} from "./util/useAsyncError";
import {RefreshSession} from "./RefreshSession";
import {Alert} from "@material-ui/lab";
import {Button, Snackbar} from "@material-ui/core";

export const LoginCheck = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loggedOutSb, setLoggedOutSb] = useState(false);
    const setError = useAsyncError();

    useEffect(() => {
        Networking
            .send(LOGIN_URL, {method: 'GET'})
            .then(() => {
                setLoggedIn(true);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                if (error instanceof NotAuthenticated) {
                    setLoggedIn(false)
                } else {
                    setError(error.message)
                }
            })
    }, [setError]);

    if (loading) return <Loading
        open={true}
        message={'Checking authentication...'}
        fullscreen={true}/>;

    if (!loggedIn) {
        return <Login setLoggedIn={setLoggedIn}/>
    } else
        return <>
            <Snackbar
                open={loggedOutSb}>
                <Alert
                    severity={'error'}
                    action={<Button color={'primary'} onClick={() => setLoggedIn(false)}>
                        Login
                    </Button>}>
                    You are logged out.
                </Alert>
            </Snackbar>
            <RefreshSession setLoggedOutSb={setLoggedOutSb}/>
            <NotificationProvider>
                <ModuleSelect setLoggedIn={setLoggedIn}/>
            </NotificationProvider>
        </>;
};
