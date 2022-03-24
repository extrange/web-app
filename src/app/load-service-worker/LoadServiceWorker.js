import { Button, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { Workbox } from "workbox-window";
import { useAsyncError } from "../../shared/useAsyncError";
import { isLocalhost, noop } from "../../shared/util";

// https://nicholaslyz.com/blog-posts/2022-03-24-best-practices-debugging-service-workers/

const hasServiceWorker = () => "serviceWorker" in navigator;

// Workbox() calls navigator.serviceWorker which is undefined in Firefox private browsing.
const wb = hasServiceWorker() ? new Workbox("./service-worker.js") : null;

const NoServiceWorker = () => {
  const [sbOpen, setSbOpen] = useState(true);

  return (
    <Snackbar
      open={sbOpen}
      onClose={() => setSbOpen(false)}
      autoHideDuration={3000}
    >
      <Alert severity={"Info"} onClose={() => setSbOpen(false)}>
        {"Service Workers are not supported in your browser"}
      </Alert>
    </Snackbar>
  );
};

const withBrowserCheck = (Component) => {
  return hasServiceWorker() ? Component : NoServiceWorker;
};

const ServiceWorkerMain = () => {
  const [sbOpen, setSbOpen] = useState(false);
  const [details, setDetails] = useState({
    text: "",
    severity: "info",
    actions: undefined,
    autoHideDuration: 3000,
  });

  const setError = useAsyncError();

  const onInstalled = (event) => {
    // For the very first installation, isUpdate will be false
    // https://developer.chrome.com/docs/workbox/modules/workbox-window/#the-very-first-time-a-service-worker-is-installed
    if (!event.isUpdate) {
      setSbOpen(true);
      setDetails({
        text: "Site is now available offline.",
        severity: "info",
        autoHideDuration: 5000,
      });
    }
  };

  const onUpdate = () => {
    /*Deactivates the previous service worker and starts running the new one, ready for requests
     * Regardless of the user's decision, the next reload will result in a new page.
     * The new sw instance must be messaged for this to work.
     * This is obtained from 'registration' set during registration of the new sw.
     * For some reason wb.messageSW messages the old SW instead.*/
    //Prompt user
    setSbOpen(true);
    setDetails({
      text: "New version available. Update?",
      severity: "info",
      autoHideDuration: null,
      actions: (
        <>
          <Button
            variant={"text"}
            color={"primary"}
            onClick={() => setSbOpen(false)}
          >
            No
          </Button>
          <Button
            variant={"text"}
            color={"primary"}
            onClick={() => {
              wb.addEventListener("controlling", () => {
                setSbOpen(false);
                window.location.reload();
              });

              /* As of v6, this method sends SKIP_WAITING to the
              correct waiting service worker (there is no need to
              obtain a reference to the new service worker)*/
              wb.messageSkipWaiting();
            }}
          >
            Yes
          </Button>
        </>
      ),
    });
  };

  const onError = (error) => {
    setSbOpen(true);
    setDetails({
      text: `Service worker update failed: ${error.toString()}`,
      autoHideDuration: null,
      severity: "error",
    });
  };

  const onLocalhost = () => {
    setSbOpen(true);
    setDetails({
      text: "On localhost, service worker registration skipped",
      autoHideDuration: 3000,
      severity: "info",
    });
  };

  useEffect(() => {
    // skip sw registration if on localhost
    if (isLocalhost) {
      onLocalhost();
      return;
    }

    wb.addEventListener("installed", onInstalled);
    wb.addEventListener("waiting", onUpdate);

    const updateSw = () => {
      if (!navigator.onLine) return;
      wb.update().catch(onError);
    };

    // Throw errors during registration, update on focus
    wb.register()
      .then(() => window.addEventListener("focus", updateSw))
      .catch((e) => setError(e));
  }, [setError]);

  return (
    <Snackbar
      open={sbOpen}
      ClickAwayListenerProps={{ onClickAway: noop }}
      onClose={() => setSbOpen(false)}
      autoHideDuration={details.autoHideDuration}
    >
      <Alert
        severity={details.severity}
        action={details.actions}
        onClose={() => setSbOpen(false)}
      >
        {details.text}
      </Alert>
    </Snackbar>
  );
};

export const LoadServiceWorker = withBrowserCheck(ServiceWorkerMain);
