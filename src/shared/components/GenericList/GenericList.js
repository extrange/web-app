import { useState } from "react";
import { AddButton } from "./../AddButton";
import { BaseItemEdit } from "./BaseItemEdit";
import { BaseList } from "./BaseList";

/* Can't be passed as a default option, otherwise it will continuously trigger re-renders */
const DefaultItemEdit = BaseItemEdit({ name: "", notes: "" });
const DefaultList = BaseList();

/**
 * Note: assumes API endpoints take objects as arguments
 *
 * context: argument passed (via spread) to all query/mutation requests
 * defaultItemValues: Object containing all fields (except id) and their default values.
 * Received as a prop on new item addition, and
 * used by BaseItemEdit to determine how many fields to render.
 *
 * List: renderer for list and items.
 * ItemEdit: renderer for editing items.
 * isItemEmpty: used by BaseItemEdit's useAutosave to determine if item should be deleted on close
 * itemIdField: field used by objects and api submission for id
 * isSkeleton: whether temporary object returned by api should be marked as a skeleton.
 * Passed to List
 *
 *
 * */
export const GenericList = ({
  getItemsQuery,
  createItemMutation,
  updateItemMutation,
  deleteItemMutation,

  defaultItemValues,
  context,
  filterBy = () => true,
  sortBy = () => 0,
  refreshOnFocus = false,
  itemProps,

  List = DefaultList,
  ItemEdit = DefaultItemEdit,
  isItemEmpty = (e) => !e.name && !e.notes,
  itemIdField = "id",
  isSkeleton = (e) => !!e.isSkeleton,
}) => {
  const { data: items, isFetching } = getItemsQuery(context);
  const [editingItem, setEditingItem] = useState(null);
  const loading = isFetching || !items;

  return (
    <>
      {!loading && (
        <AddButton onClick={() => setEditingItem(defaultItemValues)} />
      )}

      {editingItem && (
        <ItemEdit
          editingItem={
            editingItem[itemIdField]
              ? items.find((e) => e[itemIdField] === editingItem[itemIdField])
              : editingItem
          }
          closeEdit={() => void setEditingItem(null)}
          setEditingItem={setEditingItem}
          context={context}
          isItemEmpty={isItemEmpty}
          itemIdField={itemIdField}
          createItemMutation={createItemMutation}
          updateItemMutation={updateItemMutation}
          deleteItemMutation={deleteItemMutation}
        />
      )}

      <List
        context={context}
        updateItemMutation={updateItemMutation}
        deleteItemMutation={deleteItemMutation}
        refreshOnFocus={refreshOnFocus}
        filterBy={filterBy}
        items={items}
        itemIdField={itemIdField}
        itemProps={itemProps}
        isSkeleton={isSkeleton}
        loading={loading}
        setEditingItem={setEditingItem}
        sortBy={sortBy}
      />
    </>
  );
};
