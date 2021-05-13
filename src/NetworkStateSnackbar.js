import {Button} from "@material-ui/core";
import React from "react";
import {AlertSnackbarWithDialog} from "./shared/AlertSnackbarWithDialog";

/*Global object to notify user of network state*/
export const NetworkState = {
    HTTP_ERROR: 'HTTP_ERROR',
    FETCH_ERROR: 'FETCH_ERROR',
    throwError: error => {
        throw new Error(`'throwError' must be implemented`)
    }
};


/*Displays appropriate snackbars informing users of network state/errors,
* with remediation options.
*
* Accepts both Responses and Errors.*/
export const NetworkStateSnackbar = ({networkError: {message, name, object, status}, setNetworkError, logout}) => {

    /*Authentication errors. Allow user to close snackbar*/
    if (object instanceof Response && [401, 403].includes(status))
        return <AlertSnackbarWithDialog
            dialogTitle={name}
            actions={<Button color={'primary'}
                             onClick={logout}>
                Login </Button>}
            dialogContent={message}
            severity={'warning'}
            snackbarText={'You are logged out.'}
            onClose={() => setNetworkError(undefined)}
        />;


    /*Other HTTP errors (4xx/5xx). Allow user to close snackbar*/
    else if (object instanceof Response)
        return <AlertSnackbarWithDialog
            dialogTitle={name}
            actions={<Button color={'primary'} onClick={() => window.location.reload()}>
                Reload
            </Button>}
            dialogContent={message}
            severity={'error'}
            snackbarText={'An HTTP error has occurred.'}
            onClose={() => setNetworkError(undefined)}
        />;

    /*Fetch error. Allow user to close snackbar*/
    else return <AlertSnackbarWithDialog
            dialogTitle={name}
            snackbarText={'A network error has occurred.'}
            dialogContent={message}
            severity={'error'}
            actions={<Button color={'primary'} onClick={() => window.location.reload()}>
                Reload
            </Button>}
            onClose={() => setNetworkError(undefined)}
        />

};