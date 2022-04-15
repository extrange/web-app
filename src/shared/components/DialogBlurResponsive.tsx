import { Modal, useMediaQuery, useTheme } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import styled from "styled-components";

const MainDiv = styled.div`
  background: rgba(32, 33, 36, 0.85);
  box-shadow: 0px 0px 17px 12px rgba(0, 0, 0, 0.71);
  display: flex;
  flex-direction: column;
  height: inherit;

  @supports (backdrop-filter: blur(5px)) {
    backdrop-filter: blur(5px);
    background: none;
  }

  .children {
    flex: 1;
    overflow: auto;
  }

  .footer {
    cursor: move;
  }
`;

/* Dialog with overlayscrollbars (does not scroll footer component)*/
export const DialogBlurResponsive = ({
  children,
  footer,
  onClose,
  ...props
}) => {
  const theme = useTheme();
  const appbarHeight =
    theme.mixins.toolbar["@media (min-width:0px) and (orientation: landscape)"]
      .minHeight;
  const smBreakpoint = theme.breakpoints.values.sm;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const width = isMobile
    ? Math.min(window.innerWidth, smBreakpoint)
    : smBreakpoint;
  const maxHeight = isMobile
    ? window.innerHeight - appbarHeight
    : window.innerHeight * 0.9;

  const mainDivRef = useRef();
  const footerDivRef = useRef();
  const childrenDivRef = useRef();
  const [rnd, setRnd] = useState();

  /* Resize & reposition component after initial render,
  based on total height of elements */
  useEffect(() => {
    if (!rnd) return;

    // Total height of dialog including scrollable components
    const totalHeight =
      childrenDivRef.current.scrollHeight + footerDivRef.current.scrollHeight;

    rnd.updateSize({
      width,
      height: totalHeight > maxHeight ? maxHeight : mainDivRef.current.height,
    });

    rnd.updatePosition({
      x: (window.innerWidth - width) / 2,
      y: isMobile ? appbarHeight : 32, // Show appbar on mobile
    });
  }, [appbarHeight, isMobile, maxHeight, rnd, width]);

  return (
    <Modal open onClose={onClose} disableScrollLock {...props}>
      <Rnd
        disableDragging={isMobile}
        dragHandleClassName="handle"
        enableResizing={!isMobile}
        ref={(r) => setRnd(r)}
        style={{ outline: 0 }}
      >
        <MainDiv ref={mainDivRef}>
          <div className="children" ref={childrenDivRef}>
            {children}
          </div>

          <div className="handle footer" ref={footerDivRef}>
            {footer}
          </div>
        </MainDiv>
      </Rnd>
    </Modal>
  );
};
