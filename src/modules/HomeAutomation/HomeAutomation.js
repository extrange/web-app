import {AppBar} from "../../app/app-bar/AppBar";
import {Button, FormControl, InputLabel, MenuItem, Select, Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import React, {useState} from "react";
import styled from 'styled-components'
import {COMMANDS, HOME_AUTOMATION_URL} from "./urls";
import {BACKGROUND_COLOR} from "../../shared/components/backgroundScreen";
import {NETWORK_METHOD} from "../../app/constants";
import {useSend} from "../../shared/useSend";

const StyledContainer = styled.form`
  display: flex;
  max-width: 600px;
  height: 200px;
  justify-content: space-between;
  flex-direction: column;
  padding: 20px;
  ${BACKGROUND_COLOR};
`;

export const HomeAutomation = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [snackbar, setSnackbar] = useState();
    const [disabled, setDisabled] = useState(false);
    const send = useSend()

    const sendCommand = command => send(HOME_AUTOMATION_URL, {
        method: NETWORK_METHOD.POST,
        body: {command}
    });

    const handleSubmit = e => {
        e.preventDefault();
        setDisabled(true);
        setTimeout(() => setDisabled(false), 2000);
        sendCommand(e.target.command.value).then(() => setSnackbar(true));
    };

    return <AppBar
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}>
        <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            open={snackbar}
            onClose={() => setSnackbar(false)}
            autoHideDuration={3000}>
            <Alert
                variant={'filled'}
                severity={'success'}>
                Command sent
            </Alert>
        </Snackbar>
        <StyledContainer
            onSubmit={handleSubmit}>

            <FormControl>
                <InputLabel>Command</InputLabel>
                <Select
                    defaultValue={Object.entries(COMMANDS)[0][0]}
                    name={'command'}
                    required>
                    {Object.entries(COMMANDS).map(([k, v]) => <MenuItem value={k} key={k}>{v}</MenuItem>)}
                </Select>
            </FormControl>
            <Button
                disabled={disabled}
                variant={'contained'}
                color={'primary'}
                type={'submit'}
            >Send command
            </Button>
        </StyledContainer>
    </AppBar>
};