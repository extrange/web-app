import React from "react";
import {Login} from "../core/auth/Login";
import {ModuleSelect} from "./modules/ModuleSelect";
import {useSelector} from "react-redux";
import {selectLoginStatus} from "./appSlice";
import {RefreshSession} from "./refresh-session/RefreshSession";
import {Hmail} from "../modules/Hmail/Hmail";

/*Checks for login then displays appropriate component*/
export const App = () => {

    const {loggedIn} = useSelector(selectLoginStatus)

    return loggedIn ?
        <>
            <Hmail/>
            <RefreshSession/>
            <ModuleSelect/>
        </> :
        <Login/>;
};
