import {Button} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {AlertSnackbarWithDialog} from "./shared/AlertSnackbarWithDialog";

/*Global object to notify user of network state*/
export const NetworkState = {
    httpError: request => {
        throw new Error(`'httpError' must be implemented`)
    },
    fetchError: error => {
        throw new Error(`'fetchError' must be implemented`)
    },
    UNAUTHENTICATED: 'You are logged out.',
    OTHER_ERROR: 'Network error encountered.',
}


/*Displays appropriate snackbars informing users of network state/errors,
* with remediation options*/
export const NetworkStateSnackbar = ({httpState, setHttpState, setLoggedIn}) => {

    const [message, setMessage] = useState('')

    useEffect(() => httpState.httpError ?
        httpState.httpError.text().then(text => setMessage(text)) :
        null, [httpState])

    /*Authentication errors. Don't allow user to close snackbar*/
    if (httpState.httpError && [401, 403].includes(httpState.httpError.status))
        return <AlertSnackbarWithDialog
            dialogTitle={`HTTP Error ${httpState.httpError.status}: ${httpState.httpError.statusText}`}
            actions={<Button color={'primary'}
                             onClick={() => setLoggedIn(false)}>
                Login </Button>}
            dialogText={message}
            severity={'warning'}
            snackbarText={'You are logged out.'}
        />


    /*Other HTTP (4xx/5xx) errors. Allow user to close snackbar*/
    else if (httpState.httpError)
        return <AlertSnackbarWithDialog
            dialogTitle={`HTTP Error ${httpState.httpError.status}: ${httpState.httpError.statusText}`}
            actions={<Button color={'primary'} onClick={() => window.location.reload()}>
                Reload
            </Button>}
            dialogText={message}
            severity={'error'}
            snackbarText={'An HTTP error has occured.'}
            onClose={() => setHttpState(undefined)}
        />

    /*Fetch error. Don't allow user to close snackbar*/
    else return <AlertSnackbarWithDialog
            dialogTitle={httpState.fetchError.name}
            snackbarText={'A network error has occured.'}
            dialogText={httpState.fetchError.message}
            severity={'error'}
            actions={<Button color={'primary'} onClick={() => window.location.reload()}>
                Reload
            </Button>}
        />

}