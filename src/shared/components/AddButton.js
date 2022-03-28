import styled from "styled-components";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

export const AddButton = (props) => (
  <StyledFab color={"primary"} {...props}>
    <AddIcon />
  </StyledFab>
);
