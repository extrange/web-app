import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState } from "react";

/**
 * Shows notification if another backend is being used
 * (i.e. '#' fragment present in url)
 */
export const BackendSnackbar = () => {
  const [sbOpen, setSbOpen] = useState(true);
  const alternateBackend = window.location.hash.slice(1);

  return alternateBackend ? (
    <Snackbar
      open={sbOpen}
      onClose={() => setSbOpen(false)}
      autoHideDuration={3000}
    >
      <Alert severity={"info"} onClose={() => setSbOpen(false)}>
        {`Using alternate backend at ${alternateBackend}`}
      </Alert>
    </Snackbar>
  ) : null;
};
