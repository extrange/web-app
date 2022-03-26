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
export const ListItems = ({ showCompleted }) => {
  const currentList = useSelector(selectCurrentList);

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
