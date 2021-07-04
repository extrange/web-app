import { ListItemSecondaryAction } from "@material-ui/core";
import styled from "styled-components";
import { theme } from "../../../app/theme";

/* A ListItemSecondaryAction which will appear on hover for desktops,
and always appear for mobile screens. */
export const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)`
  ${theme.breakpoints.up('md')}  {
    display: none;
  }

  .MuiListItem-container:hover & {
    display: block;
  }
`;
