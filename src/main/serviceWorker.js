import {Workbox} from "workbox-window";
import React, {useEffect, useRef, useState} from 'react'
import {Button, Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {useAsyncError} from "../components/useAsyncError";
import {isLocalhost} from "../util";

// https://developers.google.com/web/tools/workbox/modules/workbox-window#important_service_worker_lifecycle_moments

const withBrowserCheck = Component => {
    return 'serviceWorker' in navigator
        ? Component
        : null
};

const wb = new Workbox('./service-worker.js');

const ServiceWorkerMain = () => {

    const intervalId = useRef();
    const [sbOpen, setSbOpen] = useState(false);
    const [details, setDetails] = useState({
        text: '',
        severity: 'info',
        actions: undefined,
        autoHideDuration: 5000,
    })

    const setError = useAsyncError()

    const reloadPage = () => {
        setSbOpen(false);
        window.location.reload()
    };

    const onInstalled = (event) => {
        //
        if (!event.isUpdate) {
            setSbOpen(true)
            setDetails({
                text: 'Site is now available offline.',
                severity: 'info',
                autoHideDuration: 5000,
            })
            console.log('Installed, isUpdate false');
        } else
            console.log('Installed, isUpdate true')
    }

    const onControlling = event => {
        if (event.isUpdate)
            console.log('Controlling, isUpdate false')
        else
            console.log('Controlling, isUpdate true')
    }

    const onActivated = event => {
        if (event.isUpdate)
            console.log('Activated, isUpdate false')
        else
            console.log('Activated, isUpdate true')
    }

    const onUpdate = () => {
        //Prompt user
        setSbOpen(true)
        setDetails({
            text: 'Site has been updated. Reload page?',
            severity: 'info',
            autoHideDuration: null,
            actions: <>
                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={() => setSbOpen(false)}
                >No</Button>
                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={reloadPage}
                >Yes</Button>
            </>
        })

        /*Deactivates the previous service worker and starts running the new one, ready for requests
        * Regardless of the user's decision, the next reload will result in a new page.*/
        wb.messageSW({type: 'SKIP_WAITING'});
        clearInterval(intervalId.current)
        console.log('Waiting for activation, newer version available');
    };

    const onError = error => {
        setSbOpen(true)
        setDetails({
            text: `Service worker update failed: ${error.toString()}`,
            autoHideDuration: null,
            severity: 'error'
        })
        console.log('Service worker update failed: ', error)
    }

    const onLocalhost = () => {
        setSbOpen(true)
        setDetails({
            text: 'On localhost, service worker registration skipped',
            autoHideDuration: 5000,
            severity: 'info'
        })
        console.log('On localhost, service worker registration skipped.')
    }

    useEffect(() => {

        // Skip SW registration if on localhost
        if (isLocalhost) {
            onLocalhost()
            return;
        }

        wb.addEventListener('controlling', onControlling);
        wb.addEventListener('activated', onActivated);
        wb.addEventListener('installed', onInstalled);
        wb.addEventListener('waiting', onUpdate);
        wb.addEventListener('externalwaiting', onUpdate); // Any other different version

        // Throw errors during registration
        wb.register().catch(e => setError(e));

        const periodicUpdateCheckId = setInterval(() => {
            console.log('Checking for service worker updates...')

            // Show snackbar on update failure, rather than throwing error
            wb.update().catch(onError)
        }, 5 * 60 * 1000);
        intervalId.current = periodicUpdateCheckId;

        // eslint-disable-next-line
    }, []);

    return <Snackbar
        open={sbOpen}
        ClickAwayListenerProps={{
            onClickAway: () => {
            }
        }}
        onClose={() => setSbOpen(false)}
        autoHideDuration={details.autoHideDuration}>
        <Alert
            severity={details.severity}
            action={details.actions}
            onClose={() => setSbOpen(false)}>
            {details.text}
        </Alert>
    </Snackbar>;
};

export const ServiceWorker = withBrowserCheck(ServiceWorkerMain);