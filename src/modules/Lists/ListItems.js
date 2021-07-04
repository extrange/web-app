import { useSelector } from "react-redux";
import { BaseList } from "../../shared/components/GenericList/BaseList";
import { BaseListItem } from "../../shared/components/GenericList/BaseListItem";
import { GenericList } from "../../shared/components/GenericList/GenericList";
import { ListItemEdit } from "./ListItemEdit";
import { useCreateItemMutation, useDeleteItemMutation, useGetItemsQuery, useUpdateItemMutation } from "./listApi";
import { selectCurrentList } from "./listsSlice";

const List = BaseList({Item: BaseListItem({
    primaryTextKey: 'title',
    secondaryTextKey: 'notes',
})})

/* List of items, for a particular List. */
export const ListItems = () => {

    const currentList = useSelector(selectCurrentList)


    // useEffect(() => {
    //     if (!currentList) return;

    //     // Prevent virtuoso from remembering the scroll position of the previously viewed list
    //     if (virtuosoRef.current) {
    //         virtuosoRef.current.scrollToIndex({ align: 'top', behavior: 'smooth' })
    //     }
    //     // eslint-disable-next-line
    // }, [currentList]);

    return (
        <GenericList
            getItemsQuery={useGetItemsQuery}
            createItemMutation={useCreateItemMutation}
            updateItemMutation={useUpdateItemMutation}
            deleteItemMutation={useDeleteItemMutation}
            defaultItemValues={{ title: '', notes: '' }}
            context={{ list: currentList.id }}
            itemIdField={'id'}

            List={List}
            ItemEdit={ListItemEdit}
            isItemEmpty={e => !e.title && !e.notes} />
    )
};