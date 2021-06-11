import styled from "styled-components";
import {ListItem, ListItemSecondaryAction} from "@material-ui/core";
import {BACKGROUND_COLOR} from "./backgroundScreen";
import {theme} from "../../app/theme";

export const StyledListItem = styled(ListItem)`
  ::before {
    margin-left: -16px;
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    ${({$hideBackground}) => $hideBackground ? '' : BACKGROUND_COLOR};
  }

  ${theme.breakpoints.up('md')} {
    ${({$reserveSpace}) => $reserveSpace ? 'padding-right: 48px' : 'padding-right: 16px'};
  }
  
  .MuiListItem-container:hover & {
    padding-right: 48px;
    
    // Highlight entire item even when secondary action is hovered
    background-color: rgba(255, 255, 255, 0.08);
  }
`;
export const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)`
  ${theme.breakpoints.up('md')}  {
    display: none;
  }

  .MuiListItem-container:hover & {
    display: block;
  }
`;