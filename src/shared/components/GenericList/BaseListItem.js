import { IconButton, ListItemText } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { StyledListItem } from "./StyledListItem";
import { StyledListItemSecondaryAction } from "./StyledListItemSecondaryAction";
import { ItemSkeleton } from "./ItemSkeleton";

/**
 * A ListItem component which can show title, notes and a delete button on hover.
 */
export const BaseListItem =
    ({
        primaryTextKey = 'title',
        secondaryTextKey = 'notes'
    }) => ({
        context,
        deleteItemMutation,
        itemIdField,
        isSkeleton,
        item,
        setEditingItem,
    }) => {

            const [deleteItem] = deleteItemMutation()

            /* Avoid destructuring item if it's a skeleton */
            if (isSkeleton(item)) {
                return <StyledListItem>
                    <ItemSkeleton />
                </StyledListItem>
            }

            const { [primaryTextKey]: primaryText, [secondaryTextKey]: secondaryText } = item

            return (
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
                                deleteItem({ [itemIdField]: item[itemIdField], ...context })
                            }}>
                            <DeleteIcon />
                        </IconButton>
                    </StyledListItemSecondaryAction>

                </StyledListItem>
            )
        }