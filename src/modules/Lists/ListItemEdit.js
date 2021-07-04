import { Button, CircularProgress, TextField, Tooltip, Typography, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { parseJSON } from "date-fns";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { DialogBlurResponsive } from "../../shared/components/DialogBlurResponsive";
import { MarkdownEditor } from "../../shared/components/MarkdownEditor/MarkdownEditor";
import { useAutosave } from "../../shared/useAutosave";
import { formatDistanceToNowPretty } from "../../shared/util";

const FooterRight = styled.div`
  display: flex; 
  justify-content: flex-end;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`;

const StyledTextField = styled(TextField)`
  margin: 5px 0;
`;

export const ListItemEdit = ({
    editingItem,
    closeEdit,
    context,
    isItemEmpty,
    itemIdField,
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
}) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [createItem, { isLoading: isLoadingCreateItem, startedTimeStamp: createItemStarted }] = createItemMutation()
    const [updateItem, { isLoading: isLoadingUpdateItem, startedTimeStamp: updateItemStarted }] = updateItemMutation()
    const [deleteItem, { isLoading: isLoadingDeleteItem }] = deleteItemMutation()

    /* Purely for within the dialog - the appBar already shows a global loading indicator */
    const loading = isLoadingCreateItem || isLoadingUpdateItem || isLoadingDeleteItem

    const useAutosaveOptions = useMemo(() => ({
        id: editingItem[itemIdField],
        updateItem: (id, data) => updateItem({ ...context, [itemIdField]: id, ...data }),
        createItem: data => createItem({ ...context, ...data }).unwrap().then(res => res.id),
        deleteItem: id => deleteItem({ ...context, [itemIdField]: id }),
        itemIsEmpty: isItemEmpty,
    }), [context, createItem, deleteItem, editingItem, isItemEmpty, itemIdField, updateItem])


    const { onChange, flush } = useAutosave(useAutosaveOptions)

    const initialTitle = editingItem.title || '';
    const initialNotes = editingItem.notes || '';

    const { register, getValues, setValue } = useForm({
        defaultValues: {
            'title': initialTitle,
            'notes': initialNotes,
        }
    });

    register('title');
    register('notes');

    const onClose = () => {
        flush()
        closeEdit()
    }

    /* If there is any update, it must be after a create.
    startedTimeStamp are used because fulfilledTimeStamp is reset when a 
    new mutation is requested, causing the UI to default to editingItem.updated
    momentarily.*/
    const lastSavedTimeString =
        updateItemStarted ?
            formatDistanceToNowPretty(updateItemStarted) :
            createItemStarted ?
                formatDistanceToNowPretty(createItemStarted) :
                editingItem.updated ?
                    formatDistanceToNowPretty(parseJSON(editingItem.updated)) :
                    ''

    /* Prefer operations with the latest possible time */
    const lastCreatedTimeString =
        createItemStarted ?
            formatDistanceToNowPretty(createItemStarted) :
            editingItem.created ?
                formatDistanceToNowPretty(parseJSON(editingItem.created)) :
                ''

    return <DialogBlurResponsive
        open
        onClose={onClose}
        footer={<Footer>
            <Tooltip
                arrow
                enterTouchDelay={100}
                interactive
                title={lastCreatedTimeString ?
                    `Created ${lastCreatedTimeString}` :
                    'Not yet created'}>
                <Typography variant={'body2'} color={'textSecondary'}>
                    {lastSavedTimeString ?
                        `Last saved ${lastSavedTimeString}` :
                        'New item'}
                </Typography>
            </Tooltip>
            <FooterRight>
                {loading && <CircularProgress color="inherit" size={20} />}
                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={onClose}>
                    Close
                </Button>
            </FooterRight>
        </Footer>}>

        <StyledTextField
            label='Title'
            multiline
            fullWidth
            name={'title'}
            autoFocus={!initialTitle && !initialNotes}
            defaultValue={initialTitle}
            variant={'outlined'}
            onChange={e => {
                setValue('title', e.target.value);
                onChange(getValues())
            }}
        />
        {fullScreen
            ? <StyledTextField
                label='Notes'
                multiline
                fullWidth
                defaultValue={getValues('notes')}
                variant={'outlined'}
                onChange={e => {
                    setValue('notes', e.target.value);
                    onChange(getValues())
                }}
            />
            : <MarkdownEditor
                defaultValue={getValues('notes')}
                onChange={newVal => {
                    setValue('notes', newVal);
                    onChange(getValues())
                }} />
        }
    </DialogBlurResponsive>
};
