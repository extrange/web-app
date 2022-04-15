import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import PublicIcon from "@material-ui/icons/Public";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useEffect, useState } from "react";
import { BackgroundScreen } from "../../shared/components/backgroundScreen";
import { Browsers } from "./Browsers";
import { TwoFactor } from "./TwoFactor";

const SUBMODULES = {
  BROWSERS: {
    name: "Browsers",
    appDrawer: (
      <>
        <ListItemIcon>
          <PublicIcon />
        </ListItemIcon>
        <ListItemText primary={"Browsers"} />
      </>
    ),
    jsx: <Browsers />,
  },
  TWOFACTOR: {
    name: "2FA Settings",
    appDrawer: (
      <>
        <ListItemIcon>
          <VpnKeyIcon />
        </ListItemIcon>
        <ListItemText primary={"2FA Settings"} />
      </>
    ),
    jsx: <TwoFactor />,
  },
};

export const Account = ({ setTitleContent, setDrawerContent }) => {
  const [submodule, setSubmodule] = useState(Object.keys(SUBMODULES)[0]);

  useEffect(() => {
    setDrawerContent(
      <List disablePadding>
        {Object.entries(SUBMODULES).map(([k, v]) => (
          <ListItem key={k} button onClick={() => setSubmodule(k)}>
            {v.appDrawer}
          </ListItem>
        ))}
      </List>
    );
  }, [setDrawerContent]);

  useEffect(() => {
    setTitleContent(
      <Typography variant={"h6"}>{SUBMODULES[submodule].name}</Typography>
    );
  }, [setTitleContent, submodule]);

  return <BackgroundScreen>{SUBMODULES[submodule].jsx}</BackgroundScreen>;
};
