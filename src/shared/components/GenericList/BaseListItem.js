import { Button, Dialog, DialogActions, DialogTitle, IconButton, ListItemText } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState } from 'react';
import { truncateString } from '../../util';
import { ItemSkeleton } from "./ItemSkeleton";
import { StyledListItem } from "./StyledListItem";
import { StyledListItemSecondaryAction } from "./StyledListItemSecondaryAction";

/**
 * A ListItem component which can show title, notes and a delete button on hover.
 * Will ask for confirmation on delete.
 */
export const BaseListItem = ({
    primaryTextKey = 'title',
    secondaryTextKey = 'notes'

}) => function GeneratedBaseListItem({
    context,
    deleteItemMutation,
    itemIdField,
    isSkeleton,
    item,
    setEditingItem }) {

        const [deleteItem] = deleteItemMutation()
        const [dialogOpen, setDialogOpen] = useState(false)

        /* Avoid destructuring item if it's a skeleton */
        if (isSkeleton(item)) {
            return <StyledListItem>
                <ItemSkeleton />
            </StyledListItem>
        }

        const { [primaryTextKey]: primaryText, [secondaryTextKey]: secondaryText } = item
        const closeDialog = () => setDialogOpen(false)

        return <>
            <Dialog
                open={dialogOpen}
                onClose={closeDialog}>
                <DialogTitle>Delete '{truncateString(primaryText, 30)}' ?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => deleteItem({ [itemIdField]: item[itemIdField], ...context })} color={'primary'}>Delete</Button>
                    <Button onClick={closeDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <StyledListItem
                button
                onClick={() => setEditingItem(item)}
                $reserveSpace={true}>

                <ListItemText
                    primary={primaryText}
                    secondary={secondaryText}
                    secondaryTypographyProps={{ noWrap: true }} />
                <StyledListItemSecondaryAction>
                    <IconButton
                        edge={'end'}
                        onClick={e => {
                            e.stopPropagation();
                            setDialogOpen(true)
                        }}>
                        <DeleteIcon />
                    </IconButton>
                </StyledListItemSecondaryAction>

            </StyledListItem>
        </>
    }