import {Workbox} from "workbox-window";
import React, {useEffect, useState} from 'react'
import {Button, Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

// https://developers.google.com/web/tools/workbox/modules/workbox-window#important_service_worker_lifecycle_moments

const withBrowserCheck = Component => {
    return 'serviceWorker' in navigator
        ? Component
        : null
};

const ServiceWorkerMain = () => {

    const [open, setOpen] = useState(false);

    const onYesToUpdate = () => {
        setOpen(false);
        window.location.reload()
    };

    useEffect(() => {
        const wb = new Workbox('/service-worker.js');

        const updatePrompt = () => {
            console.log('Waiting for activation, newer version available');

            /*Deactivates the previous service worker and starts running the new one, ready for requests
            * Regardless of the user's decision, the next reload will result in a new page.*/
            wb.messageSW({type: 'SKIP_WAITING'});

            //Prompt user
            setOpen(true)
        };

        wb.addEventListener('activated', (event) => {
            if (!event.isUpdate) {
                console.log('Service worker activated for the first time');
            } else {
                console.log('Service worker updated and activated')
            }
        });

        wb.addEventListener('waiting', updatePrompt);
        wb.addEventListener('externalwaiting', updatePrompt); // Any other different version
        wb.register(); // wb can be set with .then(() => setWb(wb))

        // Check for service worker updates every 5 min
        const periodicUpdateCheck = setInterval(() =>
            console.log('Checking for service worker updates...', wb.update()), 5 * 60 * 1000);

        return () => clearInterval(periodicUpdateCheck)
    }, []);

    return <Snackbar
        open={open}>
        <Alert
            severity={'info'}
            action={<>
                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={() => setOpen(false)}
                >No</Button>
                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={onYesToUpdate}
                >Yes</Button>
            </>}>
            Site has been updated. Reload page?
        </Alert>
    </Snackbar>;
};

export const ServiceWorker = withBrowserCheck(ServiceWorkerMain);