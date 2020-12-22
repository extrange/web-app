import styled from "styled-components";

export const BACKGROUND_COLOR = `background: rgba(0, 0, 0, 0.6)`;

//For use with already dark backgrounds
export const BACKGROUND_COLOR_LIGHT = `background: rgba(0, 0, 0, 0.3)`;
export const BACKGROUND_BOX_SHADOW = `box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.6)`;

export const BackgroundScreen = styled.div`
  ${BACKGROUND_COLOR};
`;

export const BackgroundScreenRounded = styled(BackgroundScreen)`
  border-radius: 5px;
  ${BACKGROUND_BOX_SHADOW};
`;