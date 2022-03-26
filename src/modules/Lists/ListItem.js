import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ThemeProvider,
} from "@material-ui/core";
import { orange, red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import RepeatIcon from "@material-ui/icons/Repeat";
import ScheduleIcon from "@material-ui/icons/Schedule";
import StarIcon from "@material-ui/icons/Star";
import UndoIcon from "@material-ui/icons/Undo";
import { differenceInCalendarDays, parseISO } from "date-fns";
import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "../../app/theme";
import { ItemSkeleton } from "../../shared/components/GenericList/ItemSkeleton";
import { StyledListItem } from "../../shared/components/GenericList/StyledListItem";
import { StyledListItemSecondaryAction } from "../../shared/components/GenericList/StyledListItemSecondaryAction";
import { truncateString } from "../../shared/util";

const itemTheme = createTheme({
  palette: {
    primary: red,
    secondary: orange,
  },
});

/* A ListItemIcon which will appear on hover for desktops,
and always appear for mobile screens. */
export const StyledListItemIcon = styled(ListItemIcon)`
  ${theme.breakpoints.up("md")} {
    visibility: hidden;
  }

  .MuiListItem-container:hover & {
    visibility: inherit;
  }
`;

/**
 * An item in a list, which has a title, notes, pinned indicator,
 * complete button, and menu to pin/unpin/delete.
 */
export const ListItem = ({
  primaryTextKey = "title",
  secondaryTextKey = "notes",
}) =>
  function GeneratedBaseListItem({
    context,
    updateItemMutation,
    deleteItemMutation,
    itemIdField,
    isSkeleton,
    item,
    setEditingItem,
  }) {
    const [deleteItem] = deleteItemMutation();
    const [updateItem] = updateItemMutation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState();

    const stopPropagation = (func) => (e) => {
      e.stopPropagation();
      func(e);
    };

    const daysToDue = isSkeleton(item)
      ? null
      : differenceInCalendarDays(parseISO(item.due_date), new Date());

    /* Avoid destructuring item if it's a skeleton */
    if (isSkeleton(item)) {
      return (
        <StyledListItem>
          <ItemSkeleton />
        </StyledListItem>
      );
    }

    const { [primaryTextKey]: primaryText, [secondaryTextKey]: secondaryText } =
      item;
    const closeDialog = () => setDialogOpen(false);

    return (
      <>
        <Dialog open={dialogOpen} onClose={closeDialog}>
          <DialogTitle>
            Delete '{truncateString(primaryText, 30)}' ?
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => deleteItem(item)} color={"primary"}>
              Delete
            </Button>
            <Button onClick={closeDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <StyledListItem
          button
          onClick={() => setEditingItem(item)}
          $reserveSpace={true}
        >
          {item.completed ? (
            <StyledListItemIcon>
              <IconButton
                edge={"start"}
                onClick={stopPropagation(() =>
                  updateItem({
                    ...item,
                    completeChanged: true,
                    completed: null,
                  })
                )}
              >
                <UndoIcon />
              </IconButton>
            </StyledListItemIcon>
          ) : item.pinned ? (
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
          ) : (
            <StyledListItemIcon>
              <IconButton
                edge={"start"}
                onClick={stopPropagation(() =>
                  updateItem({
                    ...item,
                    completeChanged: true,
                    completed: new Date().toISOString(),
                  })
                )}
              >
                <DoneIcon />
              </IconButton>
            </StyledListItemIcon>
          )}
          <ListItemText
            primary={primaryText}
            secondaryTypographyProps={{ component: "div", noWrap: true }}
            secondary={
              <div>
                <div>{secondaryText}</div>
                <div style={{ display: "flex" }}>
                  {item.due_date && (
                    <ThemeProvider theme={itemTheme}>
                      <Chip
                        label={
                          daysToDue === 0
                            ? "Today"
                            : daysToDue === 1
                            ? "Tomorrow"
                            : daysToDue < 1
                            ? `${Math.abs(daysToDue)} day${
                                Math.abs(daysToDue) > 1 ? "s" : ""
                              } ago`
                            : `In ${daysToDue} days`
                        }
                        icon={<ScheduleIcon />}
                        color={
                          daysToDue < 1
                            ? "primary"
                            : daysToDue < 4
                            ? "secondary"
                            : "default"
                        }
                        style={{
                          ...(daysToDue > 3 && {
                            color: "inherit",
                            border: "1px solid rgba(128,128,128,0.6)",
                          }),
                        }}
                        variant={"outlined"}
                        size={"small"}
                      />
                    </ThemeProvider>
                  )}
                  {Boolean(item.repeat_days) && (
                    <Chip
                      label={`${item.repeat_days} day${
                        item.repeat_days === 1 ? "" : "s"
                      }`}
                      icon={<RepeatIcon />}
                      style={{
                        color: "inherit",
                        border: "1px solid rgba(128,128,128,0.6)",
                      }}
                      variant={"outlined"}
                      size={"small"}
                    />
                  )}
                </div>
              </div>
            }
          />
          <Menu
            disableEnforceFocus
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={stopPropagation(() => setAnchorEl(undefined))}
          >
            <MenuItem
              onClick={stopPropagation(() => {
                updateItem({ ...item, pinned: !item.pinned });
                setAnchorEl(undefined);
              })}
            >
              {item.pinned ? "Unpin" : "Pin"}
            </MenuItem>
            <MenuItem
              onClick={stopPropagation(() => {
                setDialogOpen(true);
                setAnchorEl(undefined);
              })}
            >
              Delete
            </MenuItem>
          </Menu>
          <StyledListItemSecondaryAction>
            <IconButton
              edge={"end"}
              onClick={stopPropagation((e) => setAnchorEl(e.currentTarget))}
            >
              <MoreVertIcon />
            </IconButton>
          </StyledListItemSecondaryAction>
        </StyledListItem>
      </>
    );
  };
