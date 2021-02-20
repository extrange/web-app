import {useEffect, useState} from "react";
import {LOGIN_URL} from "./globals/urls";
import {Login} from "./Login";
import {ModuleSelect} from "./ModuleSelect";
import {Loading} from "./shared/loading";
import {NotificationProvider} from "./shared/NotificationProvider/NotificationProvider";
import {Networking, NotAuthenticated, ServerError} from "./util/networking";

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
        return <NotificationProvider>
            <ModuleSelect
            setLoggedIn={setLoggedIn}/>
    </NotificationProvider>;
};
