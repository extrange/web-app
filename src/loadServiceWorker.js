import {messageSW, Workbox} from "workbox-window";
import React, {useEffect, useRef, useState} from 'react'
import {Button, Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {useAsyncError} from "./components/useAsyncError";
import {isLocalhost} from "./util";
import {noop} from "./components/common";

// https://developers.google.com/web/tools/workbox/modules/workbox-window#important_service_worker_lifecycle_moments

const hasServiceWorker = () => 'serviceWorker' in navigator;

// Workbox() calls navigator.serviceWorker which is undefined in Firefox private browsing.
const wb = hasServiceWorker() ? new Workbox('./service-worker.js') : null;

const NoServiceWorker = () => {
    const [sbOpen, setSbOpen] = useState(true);

    return <Snackbar
        open={sbOpen}
        onClose={() => setSbOpen(false)}
        autoHideDuration={3000}>
        <Alert
            severity={'info'}
            onClose={() => setSbOpen(false)}>
            {'LoadServiceWorker is not supported in your browser'}
        </Alert>
    </Snackbar>
};

const withBrowserCheck = Component => {
    return hasServiceWorker()
    ? Component
    : NoServiceWorker;
};


const ServiceWorkerMain = () => {

    const intervalId = useRef();
    const registration = useRef({});
    const [sbOpen, setSbOpen] = useState(false);
    const [details, setDetails] = useState({
        text: '',
        severity: 'info',
        actions: undefined,
        autoHideDuration: 3000,
    });

    const setError = useAsyncError();

    const reloadPage = () => {
        setSbOpen(false);
        window.location.reload()
    };

    const onInstalled = (event) => {
        //
        if (!event.isUpdate) {
            setSbOpen(true);
            setDetails({
                text: 'Site is now available offline.',
                severity: 'info',
                autoHideDuration: 3000,
            });
            console.log('Installed, isUpdate false');
        } else
            console.log('Installed, isUpdate true')
    };

    const onControlling = event => {
        if (event.isUpdate)
            console.log('Controlling, isUpdate false');
        else
            console.log('Controlling, isUpdate true')
    };

    const onActivated = event => {
        if (event.isUpdate)
            console.log('Activated, isUpdate false');
        else
            console.log('Activated, isUpdate true')
    };

    const onUpdate = () => {
        /*Deactivates the previous service worker and starts running the new one, ready for requests
        * Regardless of the user's decision, the next reload will result in a new page.
        * The new sw instance must be messaged for this to work.
        * This is obtained from 'registration' set during registration of the new sw.
        * For some reason wb.messageSW messages the old SW instead.*/
        if (registration.current?.waiting) {
            //Prompt user
            setSbOpen(true);
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
            });

            messageSW(registration.current.waiting, {type: 'SKIP_WAITING'});
            clearInterval(intervalId.current);
            console.log('Waiting for activation, newer version available');
        }
    };

    const onError = error => {
        setSbOpen(true);
        setDetails({
            text: `Service worker update failed: ${error.toString()}`,
            autoHideDuration: null,
            severity: 'error'
        });
        console.log('Service worker update failed: ', error)
    };

    const onLocalhost = () => {
        setSbOpen(true);
        setDetails({
            text: 'On localhost, service worker registration skipped',
            autoHideDuration: 3000,
            severity: 'info'
        });
        console.log('On localhost, service worker registration skipped.')
    };

    useEffect(() => {

        // Skip SW registration if on localhost
        if (isLocalhost) {
            onLocalhost();
            return;
        }


        wb.addEventListener('controlling', onControlling);
        wb.addEventListener('activated', onActivated);
        wb.addEventListener('installed', onInstalled);
        wb.addEventListener('waiting', onUpdate);
        wb.addEventListener('externalwaiting', onUpdate); // Any other different version

        // Throw errors during registration
        wb.register().then(r => registration.current = r).catch(e => setError(e));

        // Service worker updates are checked on initial load
        const periodicUpdateCheckId = setInterval(() => {
            console.log('Checking for service worker updates...');

            // Show snackbar on update failure, rather than throwing error
            wb.update().catch(onError)
        }, 5 * 60 * 1000);
        intervalId.current = periodicUpdateCheckId;

        // eslint-disable-next-line
    }, []);

    return <Snackbar
        open={sbOpen}
        ClickAwayListenerProps={{onClickAway: noop}}
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

export const LoadServiceWorker = withBrowserCheck(ServiceWorkerMain);