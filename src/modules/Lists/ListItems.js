import { differenceInCalendarDays, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { BaseList } from "../../shared/components/GenericList/BaseList";
import { GenericList } from "../../shared/components/GenericList/GenericList";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useGetItemsQuery,
  useUpdateItemMutation,
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

  /* By default, hide repeating tasks which are not due/overdue */
  const filterRepeating = showRepeating
    ? () => true
    : (e) =>
        !e.repeat_days ||
        (e.due_date &&
          differenceInCalendarDays(parseISO(e.due_date), new Date()) < 1);

  return (
    <GenericList
      getItemsQuery={useGetItemsQuery}
      createItemMutation={useCreateItemMutation}
      updateItemMutation={useUpdateItemMutation}
      deleteItemMutation={useDeleteItemMutation}
      defaultItemValues={{ title: "", notes: "" }}
      context={{ list: currentList.id, showCompleted }}
      itemIdField={"id"}
      List={List}
      ItemEdit={ListItemEdit}
      isItemEmpty={(e) => !e.title && !e.notes}
      refreshOnFocus
      filterBy={filterRepeating}
      sortBy={(a, b) =>
        a.pinned !== b.pinned
          ? b.pinned - a.pinned
          : !(a.due_date && b.due_date)
          ? Boolean(b.due_date) - Boolean(a.due_date)
          : differenceInCalendarDays(parseISO(a.due_date), parseISO(b.due_date))
      }
    />
  );
};
