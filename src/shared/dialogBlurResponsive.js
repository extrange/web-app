import styled from "styled-components";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {Dialog} from "@material-ui/core";
import {OverlayScrollbarOptions, theme} from "../globals/theme";

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    width: min(100vw - 32px, ${({$maxWidth}) => $maxWidth}px);
  }

  // Blur effect only if supported
  @supports (backdrop-filter: blur(5px)) {
    .MuiDialog-container {
      backdrop-filter: blur(5px);
    }

    .MuiDialog-paper {
      background: none;
    }
  }

  .MuiDialog-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  // Reduce margins when on mobile
  ${theme.breakpoints.down('sm')} {

    // Extend width
    .MuiDialog-paperWidthFalse {
      max-width: calc(100% - 32px);
    }

    // Extend height
    .MuiDialog-paperScrollPaper {
      max-height: 100%;
    }

    // Add some margin to the top, and remove bottom margin settings
    .MuiDialog-paper {
      margin: 16px 0 0;
    }

  }
`;

const StyledOverlayScrollbarsComponent = styled(OverlayScrollbarsComponent)`
  .os-viewport {
    overscroll-behavior: contain;
  }
`

/* Dialog with overlayscrollbars (does not scroll footer component)*/
export const DialogBlurResponsive = ({children, footer, maxWidth=800, ...props}) =>
    <StyledDialog
        maxWidth={false}
        $maxWidth={maxWidth}
        disableScrollLock
        {...props}>
        <StyledOverlayScrollbarsComponent
            options={OverlayScrollbarOptions}
            className={'os-host-flexbox'}>
            {children}
        </StyledOverlayScrollbarsComponent>
        {footer}
    </StyledDialog>