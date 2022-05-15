import { Button } from "@material-ui/core";
import { format, formatDistanceToNowStrict, formatISO } from "date-fns";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AlertSnackbarWithDialog } from "../../shared/components/AlertSnackbarWithDialog";
import { clearNetworkError, selectNetworkError } from "../appSlice";
import { useAppSelector } from "../hooks";

/*Displays appropriate snackbars informing users of network state/errors,
 * with remediation options.
 *
 * Accepts both Responses and Errors.*/
export const NetworkErrorAlert = () => {
  const dispatch = useDispatch();
  const networkError = useAppSelector(selectNetworkError);
  const [formattedTimestamp, setFormattedTimestamp] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (networkError) {
      const update = () =>
        setFormattedTimestamp(
          formatDistanceToNowStrict(networkError.timestamp, { addSuffix: true })
        );
      const interval = setInterval(update, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [networkError]);

  if (!networkError) return null;

  const getSnackbarText = (msg: string) => `${msg} (${formattedTimestamp})`;
  const message =
    networkError.type === "misc" ? (
      <>
        <p>
          {formatISO(networkError.timestamp)}
          <p>{networkError.text}</p>
        </p>
      </>
    ) : (
      <>
        <p>
          {formatISO(networkError.timestamp)}: {networkError.method}:
          {networkError.url}
          <p>{networkError.text}</p>
        </p>
      </>
    );

  switch (networkError.type) {
    case "fetch":
      /*Allow user to close snackbar*/
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
          snackbarText={getSnackbarText("A network error has occurred.")}
          onClose={() => dispatch(clearNetworkError())}
        />
      );

    case "http":
      if ([401, 403].includes(networkError.status)) {
        /*Authentication errors. Don't allow user to close snackbar*/
        return (
          <AlertSnackbarWithDialog
            dialogTitle={"Authentication Error"}
            actions={
              <Button
                color={"primary"}
                onClick={() => window.location.reload()}
              >
                Login
              </Button>
            }
            dialogContent={message}
            onClose={() => {}}
            severity={"warning"}
            snackbarText={getSnackbarText("Authentication failure.")}
          />
        );
      } else {
        /*Other HTTP errors (4xx/5xx). Allow user to close snackbar*/
        return (
          <AlertSnackbarWithDialog
            dialogTitle={`Error ${networkError.status}`}
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
            snackbarText={getSnackbarText("An HTTP error has occured.")}
            onClose={() => dispatch(clearNetworkError())}
          />
        );
      }
    case "misc":
      /*Catch non NetworkError rejectedWithValue thunks*/
      return (
        <AlertSnackbarWithDialog
          dialogTitle={`Non NetworkError rejectWithValue thunk`}
          dialogContent={message}
          severity={"error"}
          snackbarText={getSnackbarText("A non-network error has occured.")}
          onClose={() => dispatch(clearNetworkError())}
          actions={undefined}
        />
      );
    default:
      const _exhaustiveCheck: never = networkError;
      return _exhaustiveCheck;
  }
};
