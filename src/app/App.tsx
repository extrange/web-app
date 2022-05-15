import { Loader } from "@react-three/drei";
import React, { Suspense } from "react";
import { AppBar } from "./app-bar/AppBar";
import { selectLoginStatus } from "./appSlice";
import { Login } from "./auth/Login";
import { useAppSelector } from "./hooks";
import { RefreshSession } from "./refresh-session/RefreshSession";
import { Starfield } from "./starfield/Starfield";

/*Checks for login then displays appropriate component*/
export const App = () => {
  const { loggedIn } = useAppSelector(selectLoginStatus);

  return loggedIn ? (
    <>
      <RefreshSession />
      <AppBar />
    </>
  ) : (
    <>
      <Suspense fallback={null}>
        <Starfield />
        <Login />
      </Suspense>
      <Loader />
    </>
  );
};
