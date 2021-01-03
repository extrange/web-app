import styled from "styled-components";
import {ListItem, ListItemSecondaryAction} from "@material-ui/core";
import {BACKGROUND_COLOR} from "./backgroundScreen";

export const StyledListItem = styled(ListItem)`
  ::before {
    margin-left: -16px;
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    ${props => props.$hideBackground ? '' : BACKGROUND_COLOR};
  }

  @media (hover: hover) {
    ${({$reserveSpace}) => $reserveSpace ? 'padding-right: 48px' : 'padding-right: 16px'};
  }
  
  .MuiListItem-container:hover & {
    padding-right: 48px;
  }
`;
export const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)`
  @media (hover: hover) {
    display: none;
  }

  .MuiListItem-container:hover & {
    display: block;
  }
`;