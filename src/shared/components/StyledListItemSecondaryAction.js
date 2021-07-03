import { ListItemSecondaryAction } from "@material-ui/core";
import styled from "styled-components";
import { theme } from "../../app/theme";

export const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)`
  ${theme.breakpoints.up('md')}  {
    display: none;
  }

  .MuiListItem-container:hover & {
    display: block;
  }
`;
