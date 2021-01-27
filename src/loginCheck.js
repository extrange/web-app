import {useEffect, useState} from "react";
import {Networking, NotAuthenticated, ServerError} from "./util";
import {LOGIN_URL} from "./urls";
import {Login} from "./login/login";
import {ModuleSelect} from "./moduleSelect";
import {Loading} from "./components/loading";
import {App} from "./app";

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

    if (loading) return <Loading
        open={true}
        message={'Checking authentication...'}
        fullscreen={true}/>;

    if (!loggedIn)
        return <Login
            setLoggedIn={setLoggedIn}/>;
    else
        return <App><ModuleSelect
            setLoggedIn={setLoggedIn}/></App>;
};
