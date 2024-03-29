import { Button } from "@material-ui/core";
import React from "react";
import { AlertSnackbarWithDialog } from "../../shared/components/AlertSnackbarWithDialog";
import { useDispatch, useSelector } from "react-redux";
import { clearNetworkError, selectNetworkError } from "../appSlice";
import { NETWORK_ERROR } from "../constants";
import { format, formatISO } from "date-fns";

/*Displays appropriate snackbars informing users of network state/errors,
 * with remediation options.
 *
 * Accepts both Responses and Errors.*/
export const NetworkError = () => {
  const dispatch = useDispatch();
  const networkError = useSelector(selectNetworkError);
  if (!networkError) return null;

  const { method, url, text, status, type, timestamp } = networkError;

  const message = (
    <>
      <p>
        {formatISO(timestamp)} {method}: {url}
      </p>
      <p>{text}</p>
    </>
  );

  const formattedTimestamp = format(timestamp, "HH:mm");

  switch (type) {
    case NETWORK_ERROR.FETCH_ERROR:
      /*Fetch error. Allow user to close snackbar*/
      return (
        <AlertSnackbarWithDialog
          dialogTitle={"Fetch Error"}
          actions={
            <Button color={"primary"} onClick={() => window.location.reload()}>
              Reload
            </Button>
          }
          dialogContent={message}
          severity={"error"}
          snackbarText={`[${formattedTimestamp}] A network error has occurred.`}
          onClose={() => dispatch(clearNetworkError())}
        />
      );

    case NETWORK_ERROR.HTTP_ERROR:
      if ([401, 403].includes(status)) {
        /*Authentication errors. Don't allow user to close snackbar*/
        return (
          <AlertSnackbarWithDialog
            dialogTitle={"Authentication Error"}
            actions={
              <Button
                color={"primary"}
                onClick={() => window.location.reload()}
              >
                Login{" "}
              </Button>
            }
            dialogContent={message}
            severity={"warning"}
            snackbarText={"You are logged out."}
          />
        );
      } else {
        /*Other HTTP errors (4xx/5xx). Allow user to close snackbar*/
        return (
          <AlertSnackbarWithDialog
            dialogTitle={`Error ${status}`}
            actions={
              <Button
                color={"primary"}
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
            }
            dialogContent={message}
            severity={"error"}
            snackbarText={`[${formattedTimestamp}] An HTTP error has occurred.`}
            onClose={() => dispatch(clearNetworkError())}
          />
        );
      }
    default:
      /*Catch non NetworkError rejectedWithValue thunks*/
      return (
        <AlertSnackbarWithDialog
          dialogTitle={`Non NetworkError rejectWithValue thunk`}
          dialogContent={message}
          severity={"error"}
          snackbarText={`[${formattedTimestamp}] A network error has occurred.`}
          onClose={() => dispatch(clearNetworkError())}
        />
      );
  }
};
