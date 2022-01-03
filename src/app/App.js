import { Loader } from '@react-three/drei';
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { AppBar } from "./app-bar/AppBar";
import { selectLoginStatus } from "./appSlice";
import { Login } from "./auth/Login";
import { RefreshSession } from "./refresh-session/RefreshSession";
import { Starfield } from "./starfield/Starfield";

/*Checks for login then displays appropriate component*/
export const App = () => {

    const { loggedIn } = useSelector(selectLoginStatus)

    return loggedIn ?
        <>
            <RefreshSession />
            <AppBar />
        </> :
        <>
        <Suspense fallback={null}>
            <Starfield />
            <Login />
        </Suspense>
        <Loader/>
        </>;
};
