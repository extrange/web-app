import styled from "styled-components";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Dialog } from "@material-ui/core";
import { OverlayScrollbarOptions, theme } from "../../app/theme";

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: min(100vw, 600px);
    box-shadow: 0px 0px 17px 12px rgba(0, 0, 0, 0.71);
  }

  // Start from top of screen regardless of content height
  .MuiDialog-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .MuiDialog-paper {
    background: black;
  }

  @supports (backdrop-filter: blur(5px)) {
    .MuiDialog-paper {
      backdrop-filter: blur(5px);
      background: none;
    }
  }

  // Reduce margins when on mobile
  ${theme.breakpoints.down("sm")} {
    // Extend width
    .MuiDialog-paperWidthFalse {
      max-width: calc(100% - 32px);
    }

    // Extend height
    .MuiDialog-container {
      height: 100%;
    }

    .MuiDialog-paper {
      // Keep taskbar visible
      margin: 48px 0 0;

      // Fill up screen
      max-height: initial;
    }
  }
`;

const StyledOverlayScrollbarsComponent = styled(OverlayScrollbarsComponent)`
  .os-viewport {
    overscroll-behavior: contain;
  }
`;

/* Dialog with overlayscrollbars (does not scroll footer component)*/
export const DialogBlurResponsive = ({
  children,
  footer,
  fullscreen = false,
  ...props
}) => (
  <StyledDialog
    maxWidth={false}
    disableScrollLock
    disablePortal
    $fullscreen={fullscreen}
    {...props}
  >
    <StyledOverlayScrollbarsComponent
      options={OverlayScrollbarOptions}
      className={"os-host-flexbox"}
    >
      {children}
    </StyledOverlayScrollbarsComponent>

    {footer}
  </StyledDialog>
);
