import styled from "styled-components";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {Dialog} from "@material-ui/core";
import {OverlayScrollbarOptions, theme} from "../theme";


const StyledOverlayScrollbars = styled(OverlayScrollbarsComponent)`
  width: min(100vw - 32px, 800px);
`;

const StyledDialog = styled(Dialog)`
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

/* Dialog with overlayscrollbars (does not scroll footer component)*/
export const DialogBlurResponsive = ({children, footer, ...props}) => <StyledDialog maxWidth={false} {...props}>
    <StyledOverlayScrollbars
            options={OverlayScrollbarOptions}
            className={'os-host-flexbox'}>
        {children}
    </StyledOverlayScrollbars>
    {footer}
</StyledDialog>