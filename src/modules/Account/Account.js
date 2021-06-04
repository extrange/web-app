import {AppBar} from "../../common/AppBar";
import {useState} from "react";
import {List, ListItem, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import {BackgroundScreen} from "../../common/backgroundScreen";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PublicIcon from '@material-ui/icons/Public';
import {TwoFactor} from "./TwoFactor";
import {Browsers} from "./Browsers";

const SUBMODULES = {
    BROWSERS: {
        name: 'Browsers',
        appDrawer: <>
            <ListItemIcon>
                <PublicIcon/>
            </ListItemIcon>
            <ListItemText primary={'Browsers'}/>
        </>,
        jsx: <Browsers/>
    },
    TWOFACTOR: {
        name: '2FA Settings',
        appDrawer: <>
            <ListItemIcon>
                <VpnKeyIcon/>
            </ListItemIcon>
            <ListItemText primary={'2FA Settings'}/>
        </>,
        jsx: <TwoFactor/>
    }
};

export const Account = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [submodule, setSubmodule] = useState(Object.keys(SUBMODULES)[0]);

    const drawerContent = <List disablePadding>
        {Object.entries(SUBMODULES).map(([k, v]) =>
            <ListItem key={k}
                      button
                      onClick={() => setSubmodule(k)}
            >{v.appDrawer}</ListItem>)}
    </List>;

    return <AppBar
        drawerContent={drawerContent}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        titleContent={<Typography variant={'h6'}>{SUBMODULES[submodule].name}</Typography>}>
        <BackgroundScreen>
            {SUBMODULES[submodule].jsx}
        </BackgroundScreen>

    </AppBar>
};