import React from "react";
import {Login} from "./Login/Login";
import {ModuleSelect} from "./ModuleSelect";
import {NotificationProvider} from "./NotificationProvider/NotificationProvider";
import {useSelector} from "react-redux";
import {selectLoginStatus} from "./appSlice";
import {RefreshSession} from "./RefreshSession/RefreshSession";

/*Checks for login then displays appropriate component*/
export const App = () => {

    const {loggedIn} = useSelector(selectLoginStatus)

    return loggedIn ?
        <NotificationProvider>
            <RefreshSession/>
            <ModuleSelect/>
        </NotificationProvider> :
        <Login/>;
};
