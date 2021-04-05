import {AppBarResponsive} from "../../shared/AppBarResponsive";
import {useState} from "react";
import {Typography} from "@material-ui/core";
import {PasswordList} from "./PasswordList";


export const Passwords = ({returnToMainApp, logout}) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [passwords, setPasswords] = useState([])


    return <AppBarResponsive
        drawerOpen={drawerOpen}
        drawerContent={null}
        returnToMainApp={returnToMainApp}
        logout={logout}
        setDrawerOpen={setDrawerOpen}
        titleContent={<Typography variant={'h6'}>Passwords</Typography>}
        appName={'Passwords'}
    >
        <PasswordList
            passwords={passwords}
            setPasswords={setPasswords}
        />
    </AppBarResponsive>


}