import { TextField, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { DialogBlurResponsive } from "../../shared/components/dialogBlurResponsive";
import { MarkdownEditor } from "../../shared/components/MarkdownEditor/MarkdownEditor";
import { useAutosave } from "../../shared/useAutosave";
import { useCreateItemMutation, useDeleteItemMutation, useUpdateItemMutation } from "./listApi";
import { selectCurrentList } from "./listsSlice";

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

const SavingStates = {
    UNCHANGED: 1,
    MODIFIED: 2,
    SAVED: 3
};

const StyledTextField = styled(TextField)`
  margin: 5px 0;
`;

/*If editingTask.id is null, a new task is being created*/
export const EditItem = ({ closeEdit, editingItem, setLoading }) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const currentListId = useSelector(selectCurrentList)?.id

    const [createItem, { isLoading: isLoadingCreateItem }] = useCreateItemMutation()
    const [updateItem, { isLoading: isLoadingUpdateItem }] = useUpdateItemMutation()
    const [deleteItem, { isLoading: isLoadingDeleteItem }] = useDeleteItemMutation()

    const loading = isLoadingCreateItem || isLoadingUpdateItem || isLoadingDeleteItem

    useEffect(() => void setLoading(loading), [loading, setLoading])

    const { onChange, flush } = useAutosave({
        id: editingItem?.id,
        updateItem: (id, data) => updateItem({ list: currentListId, id, ...data }),
        createItem: data => createItem({ list: currentListId, ...data }).unwrap().then(res => res.id),
        deleteItem: id => deleteItem({ list: currentListId, id }),
        itemIsEmpty: data => !data.title && !data.notes
    })

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

    return <DialogBlurResponsive
        open
        onClose={() => {
            flush()
            closeEdit()
        }}
        footer={<Footer>
            {/*<Tooltip*/}
            {/*    arrow*/}
            {/*    enterTouchDelay={100}*/}
            {/*    interactive*/}
            {/*    title={editingItem.created ? `Created ${formatDistanceToNowPretty(parseJSON(editingItem.created))}` : ''}>*/}
            {/*    <Typography variant={'body2'} color={'textSecondary'}>*/}
            {/*        Edited {saving === SavingStates.UNCHANGED && editingItem.updated ?*/}
            {/*        formatDistanceToNowPretty(parseJSON(editingItem.updated)) :*/}
            {/*        'just now'}*/}
            {/*    </Typography>*/}
            {/*</Tooltip>*/}
            {/*<FooterRight>*/}
            {/*    {{*/}
            {/*        [SavingStates.UNCHANGED]: null,*/}
            {/*        [SavingStates.MODIFIED]: <CircularProgress color="inherit" size={20}/>,*/}
            {/*        [SavingStates.SAVED]:*/}
            {/*            <Zoom*/}
            {/*                in={saving === SavingStates.SAVED}>*/}
            {/*                <CheckIcon/>*/}
            {/*            </Zoom>,*/}
            {/*    }[saving]}*/}
            {/*    <Button*/}
            {/*        variant={'text'}*/}
            {/*        color={'primary'}*/}
            {/*        onClick={handleClose}>*/}
            {/*        Close*/}
            {/*    </Button>*/}
            {/*</FooterRight>*/}
            {loading && 'loading'}
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
