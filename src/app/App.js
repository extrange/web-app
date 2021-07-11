import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Hmail } from "../modules/Hmail/Hmail";
import { Loading } from "../shared/components/Loading";
import { RandomBackground } from "../shared/components/randomBackground";
import { AppBar } from "./app-bar/AppBar";
import { selectLoginStatus } from "./appSlice";
import { Login } from "./auth/Login";
import { RefreshSession } from "./refresh-session/RefreshSession";

/*Checks for login then displays appropriate component*/
export const App = () => {

    const { loggedIn, isSuperUser } = useSelector(selectLoginStatus)

    return loggedIn ?
        <>
            {isSuperUser && <Hmail />}
            <RefreshSession />
            <AppBar />
            <RandomBackground />
        </> :
        <Suspense fallback={<Loading />}>
            <Login />
        </Suspense>;
};
