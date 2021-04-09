import {Fab, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import React, {useCallback, useEffect, useState} from 'react'
import styled from 'styled-components'
import {BACKGROUND_COLOR} from "../../shared/backgroundScreen";
import AddIcon from "@material-ui/icons/Add";
import * as Url from './urls'
import {addPassword, updatePassword} from './urls'
import {PasswordDialog} from "./PasswordDialog";
import {compareDesc, parseJSON} from 'date-fns'

const StyledList = styled(List)`
  max-width: 600px;
  ${BACKGROUND_COLOR};
`

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

export const PasswordList = ({
                                 passwords,
                                 setPasswords
                             }) => {

    const [editingItem, setEditingItem] = useState(false)

    const onClose = () => setEditingItem(null)
    const onClickItem = item => setEditingItem(item)

    const getPasswords = useCallback(() => Url.getPasswords().then(r => setPasswords(r)), [setPasswords])
    const onDelete = id => Url.deletePassword(id).then(getPasswords)

    const onSubmit = (data, id) => {
        if (id) {
            // Editing item
            updatePassword(data, id).then(getPasswords)
            setEditingItem(null)
        } else {
            // Adding item
            addPassword(data).then(getPasswords)
            setEditingItem(null)
        }
    }

    /*Refetch on initial render*/
    useEffect(() => void getPasswords(), [getPasswords])


    return <>
        <StyledFab color={'primary'} onClick={() => setEditingItem(true)}>
            <AddIcon/>
        </StyledFab>
        {editingItem && <PasswordDialog
            onClose={onClose}
            onSubmit={onSubmit}
            editingItem={editingItem}
        />}
        <StyledList>
            {passwords.sort((a, b) =>
                compareDesc(parseJSON(a.date_added), parseJSON(b.date_added)))
                .map(item => <ListItem
                    button
                    key={item.id}
                    onClick={() => onClickItem(item)}
                >
                    <ListItemText
                        primary={item.title}
                    />
                    <ListItemSecondaryAction>
                        <IconButton onClick={() => onDelete(item.id)}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>)}
        </StyledList>
    </>
}