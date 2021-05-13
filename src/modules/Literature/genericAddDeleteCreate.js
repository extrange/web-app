import {Fab, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {BACKGROUND_COLOR} from "../../shared/backgroundScreen";
import AddIcon from "@material-ui/icons/Add";
import {GenericAddDeleteCreateDialog} from "./genericAddDeleteCreateDialog";

const StyledList = styled(List)`
  max-width: 600px;
  ${BACKGROUND_COLOR};
`;

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;


/*Generic CRUD display for Authors/Genres/Types (for now)
* Assumes keys id, name and notes are present on the object*/
export const GenericAddDeleteCreate = ({
                                           types,
                                           getType,
                                           addType,
                                           updateType,
                                           deleteType,
                                       }) => {
    const [editingItem, setEditingItem] = useState(false);

    const onDelete = id => deleteType(id).then(getType);

    const onClose = () => setEditingItem(null);


    const onClickItem = item => setEditingItem(item);

    const onSubmit = (data, id) => {
        if (id) {
            // Editing item
            updateType(data, id).then(getType);
            setEditingItem(null)
        } else {
            // Adding item
            addType(data).then(getType);
            setEditingItem(null)
        }
    };

    /*Refetch on initial render*/
    useEffect(() => void getType(), [getType]);


    return <>
        <StyledFab color={'primary'} onClick={() => setEditingItem(true)}>
            <AddIcon/>
        </StyledFab>
        {editingItem && <GenericAddDeleteCreateDialog
            editingItem={editingItem}
            onClose={onClose}
            onSubmit={onSubmit}
        />}
        <StyledList>
            {types.map(item => <ListItem
                button
                key={item.id}
                onClick={() => onClickItem(item)}
            >
                <ListItemText
                    primary={item.name}
                    secondary={item.notes}
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={() => onDelete(item.id)}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>)}
        </StyledList>
    </>
};