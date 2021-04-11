import {Button} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {AlertSnackbarWithDialog} from "./shared/AlertSnackbarWithDialog";

/*Global object to notify user of network state*/
export const NetworkState = {
    throwError: error => {
        throw new Error(`'throwError' must be implemented`)
    }
}


/*Displays appropriate snackbars informing users of network state/errors,
* with remediation options.
*
* Accepts both Responses and Errors.*/
export const NetworkStateSnackbar = ({networkError, setNetworkError, logout}) => {

    const [message, setMessage] = useState('')

    useEffect(() => networkError instanceof Response ?
        networkError.text().then(text => setMessage(text)) :
        null, [networkError])

    /*Authentication errors. Allow user to close snackbar*/
    if (networkError instanceof Response && [401, 403].includes(networkError.status))
        return <AlertSnackbarWithDialog
            dialogTitle={`HTTP Error ${networkError.status}: ${networkError.statusText}`}
            actions={<Button color={'primary'}
                             onClick={logout}>
                Login </Button>}
            dialogText={message}
            severity={'warning'}
            snackbarText={'You are logged out.'}
            onClose={() => setNetworkError(undefined)}
        />


    /*Other HTTP errors (4xx/5xx). Allow user to close snackbar*/
    else if (networkError instanceof Response)
        return <AlertSnackbarWithDialog
            dialogTitle={`HTTP Error ${networkError.status}: ${networkError.statusText}`}
            actions={<Button color={'primary'} onClick={() => window.location.reload()}>
                Reload
            </Button>}
            dialogText={message}
            severity={'error'}
            snackbarText={'An HTTP error has occurred.'}
            onClose={() => setNetworkError(undefined)}
        />

    /*Fetch error. Allow user to close snackbar*/
    else return <AlertSnackbarWithDialog
            dialogTitle={networkError.name}
            snackbarText={'A network error has occurred.'}
            dialogText={networkError.message}
            severity={'error'}
            actions={<Button color={'primary'} onClick={() => window.location.reload()}>
                Reload
            </Button>}
            onClose={() => setNetworkError(undefined)}
        />

}