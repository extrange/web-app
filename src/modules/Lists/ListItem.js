import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
} from "@material-ui/core";
import { orange, red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import ScheduleIcon from "@material-ui/icons/Schedule";
import StarIcon from "@material-ui/icons/Star";
import { differenceInCalendarDays, parseISO } from "date-fns";
import React, { useState } from "react";
import { ItemSkeleton } from "../../shared/components/GenericList/ItemSkeleton";
import { StyledListItem } from "../../shared/components/GenericList/StyledListItem";
import { StyledListItemSecondaryAction } from "../../shared/components/GenericList/StyledListItemSecondaryAction";
import { truncateString } from "../../shared/util";

const theme = createTheme({
  palette: {
    primary: red,
    secondary: orange,
  },
});

/**
 * A ListItem component which can show title, notes and a delete button on hover.
 * Will ask for confirmation on delete.
 */
export const ListItem = ({
  primaryTextKey = "title",
  secondaryTextKey = "notes",
}) =>
  function GeneratedBaseListItem({
    context,
    deleteItemMutation,
    itemIdField,
    isSkeleton,
    item,
    setEditingItem,
  }) {
    const [deleteItem] = deleteItemMutation();
    const [dialogOpen, setDialogOpen] = useState(false);

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
    const daysToDue = differenceInCalendarDays(
      parseISO(item.due_date),
      new Date()
    );
    const daysToDueText =
      daysToDue === 0
        ? "Today"
        : daysToDue === 1
        ? "Tomorrow"
        : daysToDue < 1
        ? `${Math.abs(daysToDue)} day${Math.abs(daysToDue) > 1 ? "s" : ""} ago`
        : `In ${daysToDue} days`;

    return (
      <>
        <Dialog open={dialogOpen} onClose={closeDialog}>
          <DialogTitle>
            Delete '{truncateString(primaryText, 30)}' ?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() =>
                deleteItem({ [itemIdField]: item[itemIdField], ...context })
              }
              color={"primary"}
            >
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
          {item.pinned && (
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
          )}
          <ListItemText
            primary={primaryText}
            secondaryTypographyProps={{ component: "div", noWrap: true }}
            secondary={
              <div>
                <div>{secondaryText}</div>
                {item.due_date && (
                  <div>
                    <ThemeProvider theme={theme}>
                      <Chip
                        label={daysToDueText}
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
                  </div>
                )}
              </div>
            }
          />
          <StyledListItemSecondaryAction>
            <IconButton
              edge={"end"}
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </StyledListItemSecondaryAction>
        </StyledListItem>
      </>
    );
  };
