import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { styled as muiStyled } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const StyledDialog = muiStyled(Dialog)(({ theme }) => ({
  /*As zIndex is set inline in Dialog, style must be overridden with !important*/
  zIndex: `${theme.zIndex.snackbar + 1} !important`,
}));

/* Display snackbar with dialog.
 * Omit onClose to prevent user from dismissing alert
 * Omit dialogTitle & dialogText to disable dialog*/
export const AlertSnackbarWithDialog = ({
  severity = "error",
  onClose,
  snackbarText,
  dialogTitle,
  dialogContent,
  actions,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogEnabled = Boolean(dialogTitle && dialogContent);

  return (
    <>
      {dialogEnabled && (
        <StyledDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          scroll={"body"}
        >
          <DialogTitle>{dialogTitle}</DialogTitle>

          <DialogContent>
            <DialogContentText
              component={"div"}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {dialogContent}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              variant={"text"}
              color={"primary"}
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </DialogActions>
        </StyledDialog>
      )}
      <Snackbar open>
        <Alert
          severity={severity}
          action={
            <>
              {dialogEnabled && (
                <Button
                  variant={"text"}
                  color={"primary"}
                  onClick={() => setDialogOpen(true)}
                >
                  Details
                </Button>
              )}
              {actions}
              {onClose && (
                <IconButton size="small" color="inherit" onClick={onClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </>
          }
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </>
  );
};
