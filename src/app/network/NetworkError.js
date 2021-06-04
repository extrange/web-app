import {Button} from "@material-ui/core";
import React from "react";
import {AlertSnackbarWithDialog} from "../../common/AlertSnackbarWithDialog";
import {useDispatch, useSelector} from "react-redux";
import {clearNetworkError, logout, selectNetworkError} from "../appSlice";

export const NETWORK_ERROR = {
    HTTP_ERROR: 0,
    FETCH_ERROR: 1,
}

/*Displays appropriate snackbars informing users of network state/errors,
* with remediation options.
*
* Accepts both Responses and Errors.*/
export const NetworkError = () => {

    const dispatch = useDispatch()
    const networkError = useSelector(selectNetworkError)
    if (!networkError) return null
    const {
        message: {method = 'No method specified', url = 'No url specified', text = ''},
        name,
        type,
        status = null /*Must be specified if HTTP_ERROR*/
    } = networkError

    const message = <>
        <p>{method}: {url}</p>
        <p>{text}</p>
    </>

    switch (type) {
        case NETWORK_ERROR.FETCH_ERROR:
            /*Fetch error. Allow user to close snackbar*/
            return <AlertSnackbarWithDialog
                dialogTitle={name}
                actions={<Button color={'primary'} onClick={() => window.location.reload()}>
                    Reload
                </Button>}
                dialogContent={message}
                severity={'error'}
                snackbarText={'A network error has occurred.'}
                onClose={() => dispatch(clearNetworkError())}/>

        case NETWORK_ERROR.HTTP_ERROR:
            if (typeof status !== 'number')
                throw new Error(`NetworkError: 'status' must be a number if 
            'type' === HTTP_ERROR, but got ${status} instead`)

            if ([401, 403].includes(status)) {
                /*Authentication errors. Don't allow user to close snackbar*/
                return <AlertSnackbarWithDialog
                    dialogTitle={name}
                    actions={<Button color={'primary'}
                                     onClick={() => dispatch(logout())}>
                        Login </Button>}
                    dialogContent={message}
                    severity={'warning'}
                    snackbarText={'You are logged out.'}/>;

            } else {
                /*Other HTTP errors (4xx/5xx). Allow user to close snackbar*/
                return <AlertSnackbarWithDialog
                    dialogTitle={name}
                    actions={<Button color={'primary'} onClick={() => window.location.reload()}>
                        Reload
                    </Button>}
                    dialogContent={message}
                    severity={'error'}
                    snackbarText={'An HTTP error has occurred.'}
                    onClose={() => dispatch(clearNetworkError())}/>;
            }
        default:
            throw new Error(`NetworkError: Uncaught type: ${type}.
            You must explicitly specify and catch all NETWORK_ERRORs.`);
    }
};