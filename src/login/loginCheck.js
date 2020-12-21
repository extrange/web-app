import React, {useEffect, useState} from "react";
import {Networking, NotAuthenticated, ServerError} from "../util";
import {LOGIN_URL} from "../urls";
import {Login} from "./login";
import {flowRight} from 'lodash'
import {ModuleSelect} from "../moduleSelect";
import {Loading} from "../components/loading";


const withLoginCheck = Component => ({loggedIn, ...props}) => {
    return loggedIn
        ? <Component {...props}/>
        : <Login {...props}/>
};

const withLoading = Component => ({loading, message, ...props}) => {
    return loading
        ? <Loading
            open={loading}
            message={message}/>
        : <Component {...props} />
};

const LoginCheckWithLoginLoading =
    flowRight([
        withLoading,
        withLoginCheck,
    ])(ModuleSelect);

export const LoginCheck = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkIfLoggedIn = () => {
        setLoading(true);
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
                    throw new ServerError(error.message)
                }
            })
    };

    useEffect(checkIfLoggedIn, []);

    return <LoginCheckWithLoginLoading
        message={'Checking authentication...'}
        loggedIn={loggedIn}
        loading={loading}
        setLoggedIn={setLoggedIn}/>
    ;
};
