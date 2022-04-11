import { Button, IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { compareAsc, differenceInCalendarDays, parseISO } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BaseList } from "../../shared/components/GenericList/BaseList";
import { GenericList } from "../../shared/components/GenericList/GenericList";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useGetItemsQuery,
  useUpdateItemMutation
} from "./listApi";
import { ListItem } from "./ListItem";
import { ListItemEdit } from "./ListItemEdit";
import { selectCurrentList } from "./listsSlice";

const List = BaseList({
  Item: ListItem({
    primaryTextKey: "title",
    secondaryTextKey: "notes",
  }),
});

/* The list of items for a particular List. */
export const ListItems = ({ showCompleted, showRepeating }) => {
  const currentList = useSelector(selectCurrentList);
  const [completedItem, setCompletedItem] = useState();
  const [updateItem] = useUpdateItemMutation();

  /* By default, hide repeating tasks which are not due/overdue */
  const filterRepeating = showRepeating
    ? () => true
    : (e) =>
        !e.repeat_days ||
        (e.due_date &&
          differenceInCalendarDays(parseISO(e.due_date), new Date()) < 1);

  const context = useMemo(
    () => ({ list: currentList.id, showCompleted }),
    [currentList, showCompleted]
  );

  const isItemEmpty = useCallback((e) => !e.title && !e.notes, []);

  const handleClose = () => setCompletedItem(null);
  const undoCompletedItem = () => {
    updateItem({ ...completedItem, completeChanged: true });
    setCompletedItem(null);
  };

  return (
    <>
      <Snackbar
        autoHideDuration={3000}
        open={!!completedItem}
        onClose={handleClose}
        message={"Item completed"}
        action={
          <>
            <Button
              color={"secondary"}
              size={"small"}
              onClick={undoCompletedItem}
            >
              Undo
            </Button>
            <IconButton size={"small"} color={"inherit"} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </>
        }
      />
      <GenericList
        getItemsQuery={useGetItemsQuery}
        createItemMutation={useCreateItemMutation}
        updateItemMutation={useUpdateItemMutation}
        deleteItemMutation={useDeleteItemMutation}
        defaultItemValues={{ title: "", notes: "" }}
        context={context}
        itemIdField={"id"}
        itemProps={{ setCompletedItem }}
        List={List}
        ItemEdit={ListItemEdit}
        isItemEmpty={isItemEmpty}
        refreshOnFocus
        filterBy={filterRepeating}
        sortBy={(a, b) =>
          showCompleted
            ? compareAsc(a, b)
            : a.pinned !== b.pinned
            ? b.pinned - a.pinned
            : !(a.due_date && b.due_date)
            ? Boolean(b.due_date) - Boolean(a.due_date)
            : differenceInCalendarDays(
                parseISO(a.due_date),
                parseISO(b.due_date)
              )
        }
      />
    </>
  );
};
