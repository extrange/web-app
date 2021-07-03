import { IconButton, ListItemText, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useState } from 'react';
import { StyledListItem, StyledListItemSecondaryAction } from "../../shared/components/StyledListItem";
import { useDeleteListMutation, useUpdateListMutation } from "./listApi";

export const List = ({ onClick, list: { title, id } }) => {

    const [deleteList] = useDeleteListMutation()
    const [updateList] = useUpdateListMutation()

    const [anchorEl, setAnchorEl] = useState()

    const stopPropagation = func => e => {
        e.stopPropagation()
        func(e)
    }

    const editTitle = () => {
        setAnchorEl(undefined)
        let newTitle = prompt('Enter new title:', title)
        if (newTitle) {
            updateList({title: newTitle, id})
        }
    }

    return <StyledListItem
        button
        onClick={onClick}
        $hideBackground
        $reserveSpace={false}>
        <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={stopPropagation(e => setAnchorEl(undefined))}>
            <MenuItem onClick={stopPropagation(editTitle)}>Edit</MenuItem>
            <MenuItem onClick={stopPropagation(() => deleteList({id}))}>Delete</MenuItem>
        </Menu>
        <ListItemText
            primary={title}
            primaryTypographyProps={{ noWrap: true }}
        />
        <StyledListItemSecondaryAction>
            <IconButton
                edge={'end'}
                onClick={stopPropagation(e => setAnchorEl(e.currentTarget))}>
                <MoreVertIcon />
            </IconButton>
        </StyledListItemSecondaryAction>

    </StyledListItem>
};
