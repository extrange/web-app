import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import styled from "styled-components";
import { BACKGROUND_COLOR } from "../../shared/components/backgroundScreen";
import { useSendCommandMutation } from "./homeAutomationApi";

const StyledContainer = styled.form`
  display: flex;
  max-width: 600px;
  height: 200px;
  justify-content: space-between;
  flex-direction: column;
  padding: 20px;
  ${BACKGROUND_COLOR};
`;

export const COMMANDS = {
  gate_toggle: "Gate: Toggle",
  ac_off: "AC: Off",
  ac_on_24: "AC: On @ 24°C",
  ac_on_25: "AC: On @ 25°C",
  ceiling_fan_on: "Ceiling Fan: On",
  ceiling_fan_off: "Ceiling Fan: Off",
  dyson_fan_on: "Dyson Fan: On",
  dyson_fan_off: "Dyson Fan: Off",
};

export const HomeAutomation = () => {
  const [sendCommand] = useSendCommandMutation();

  const [snackbar, setSnackbar] = useState();
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);
    setTimeout(() => setDisabled(false), 2000);
    sendCommand(e.target.command.value)
      .unwrap()
      .then(() => setSnackbar(true));
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar}
        onClose={() => setSnackbar(false)}
        autoHideDuration={3000}
      >
        <Alert variant={"filled"} severity={"success"}>
          Command sent
        </Alert>
      </Snackbar>
      <StyledContainer onSubmit={handleSubmit}>
        <FormControl>
          <InputLabel>Command</InputLabel>
          <Select
            defaultValue={Object.entries(COMMANDS)[0][0]}
            name={"command"}
            required
          >
            {Object.entries(COMMANDS).map(([k, v]) => (
              <MenuItem value={k} key={k}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          disabled={disabled}
          variant={"contained"}
          color={"primary"}
          type={"submit"}
        >
          Send command
        </Button>
      </StyledContainer>
    </>
  );
};
