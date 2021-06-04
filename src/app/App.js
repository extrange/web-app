import React, {useEffect, useState} from "react";
import {Login} from "./Login";
import {ModuleSelect} from "./ModuleSelect";
import {Loading} from "../common/loading";
import {NotificationProvider} from "../common/NotificationProvider/NotificationProvider";
import {RefreshSession} from "./RefreshSession";
import {useDispatch, useSelector} from "react-redux";
import {checkIfLoggedIn, selectLoginStatus} from "./appSlice";
import {Networking} from "./network/networking";
import {RECAPTCHA_KEY_URL} from "./urls";

/*Login checks handled here*/
export const App = () => {

    const dispatch = useDispatch()
    const {loggedIn} = useSelector(selectLoginStatus)

    const [checkingIfLoggedIn, setCheckingIfLoggedIn] = useState(true);
    const [recaptchaKey, setRecaptchaKey] = useState();

     const fetchRecaptchaKey = () => void Networking.send(RECAPTCHA_KEY_URL)
        .then(r => r.json())
        .then(r => void setRecaptchaKey(r['key']));


    useEffect(() => {
        dispatch(checkIfLoggedIn()).then(() => setCheckingIfLoggedIn(false))
        fetchRecaptchaKey()
    }, [dispatch]);

    if (checkingIfLoggedIn ||
        (!loggedIn && !recaptchaKey))
        return <Loading
            open={true}
            message={checkingIfLoggedIn ? 'Checking authentication...' : 'Obtaining site recaptchaKey...'}
            fullscreen={true}/>;

    return loggedIn ?
        <>
            <RefreshSession/>
            <NotificationProvider>
                <ModuleSelect/>
            </NotificationProvider>
        </> :
        <Login recaptchaKey={recaptchaKey}/>
};
