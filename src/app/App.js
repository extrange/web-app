import React from "react";
import {Login} from "./auth/Login";
import {useSelector} from "react-redux";
import {selectLoginStatus} from "./appSlice";
import {RefreshSession} from "./refresh-session/RefreshSession";
import {Hmail} from "../modules/Hmail/Hmail";
import {AppBar} from "./app-bar/AppBar";

/*Checks for login then displays appropriate component*/
export const App = () => {

    const {loggedIn, isSuperUser} = useSelector(selectLoginStatus)

    return loggedIn ?
        <>
            {isSuperUser && <Hmail/>}
            <RefreshSession/>
            <AppBar/>
        </> :
        <Login/>;
};
