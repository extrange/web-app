import {IconButton, ListItemText} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {StyledListItem, StyledListItemSecondaryAction} from "../../shared/components/styledListItem";
import {useDeleteItemMutation} from "./listApi";
import {useSelector} from "react-redux";
import {selectCurrentList} from "./listsSlice";


export const Item = ({setEditingItem, item}) => {
    const {id, title, notes} = item
    const [deleteItem] = useDeleteItemMutation()
    const currentListId = useSelector(selectCurrentList)?.id

    return <StyledListItem
        button
        onClick={() => setEditingItem(item)}
        $reserveSpace={true}>
        <ListItemText
            primary={title}
            secondary={notes}
            secondaryTypographyProps={{noWrap: true}}/>
        <StyledListItemSecondaryAction>
            <IconButton
                edge={'end'}
                onClick={e => {
                    e.stopPropagation();
                    deleteItem({list: currentListId, id})
                }}>
                <DeleteIcon/>
            </IconButton>
        </StyledListItemSecondaryAction>

    </StyledListItem>;
}