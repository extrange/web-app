import styled from "styled-components";
import {MarkdownEditor} from "../../common/MarkdownEditor/MarkdownEditor";
import {Button, CircularProgress, TextField, Tooltip, Typography, useMediaQuery, Zoom} from "@material-ui/core";
import {useForm} from "react-hook-form";
import {useTheme} from "@material-ui/core/styles";
import {debounce} from 'lodash'
import {useCallback, useRef, useState} from "react";
import {formatDistanceToNowPretty, isEmpty} from "../../common/util";
import {DialogBlurResponsive} from "../../common/dialogBlurResponsive";
import CheckIcon from '@material-ui/icons/Check';
import {parseJSON} from "date-fns";

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

export const EditItem = ({editingTask, createTask, updateTask, closeEdit, listItems, currentList, deleteTask}) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [saving, setSaving] = useState(SavingStates.UNCHANGED);
    const taskId = useRef(editingTask.id);
    const creatingTask = useRef(false);

    const initialTitle = editingTask.title || '';
    const initialNotes = editingTask.notes || '';

    const {register, getValues, setValue} = useForm({
        defaultValues: {
            'title': initialTitle,
            'notes': initialNotes,
        }
    });

    register('title');
    register('notes');

    // eslint-disable-next-line
    const debouncedAutoSave = useCallback(debounce(() => {
        let {title, notes} = getValues();

        let update = () => updateTask(taskId.current, currentList, title, notes)
            .then(() => {
                setSaving(SavingStates.SAVED);
            });

        if (taskId.current) {
            return update();

        } else if (!creatingTask.current) {

            // Task has not been created
            // Prevent subsequent calls from calling createTask() while awaiting server reply
            creatingTask.current = true;

            return createTask(currentList, title, notes).then(json => {
                taskId.current = json.id;
                setSaving(SavingStates.SAVED);
            })
        } else return Promise.resolve()

        // todo Calls while creatingTask.current = true will be lost
        //, albeit the gap is very narrow (server reply must take > debounceTime)


    }, 1000, {maxWait: 5000}), [updateTask, editingTask, createTask]);

    const handleClose = () => {
        //  getValues is null once closeEdit() is called
        let {title, notes} = getValues();

        // debouncedAutoSave.flush() is only defined when it has been called at least once
        debouncedAutoSave.flush()?.then(() => {

            // Delete task if it's empty
            if (taskId.current && isEmpty(title) && isEmpty(notes)) {
                deleteTask(taskId.current, currentList, false)
            } else listItems(currentList);

        });

        closeEdit();
    };

    const autoSave = () => {
        setSaving(SavingStates.MODIFIED);
        debouncedAutoSave()
    };


    return <DialogBlurResponsive
        open
        onClose={handleClose}
        footer={<Footer>
            <Tooltip
                arrow
                enterTouchDelay={100}
                interactive
                title={editingTask.created ? `Created ${formatDistanceToNowPretty(parseJSON(editingTask.created))}` : ''}>
                <Typography variant={'body2'} color={'textSecondary'}>
                    Edited {saving === SavingStates.UNCHANGED && editingTask.updated ?
                    formatDistanceToNowPretty(parseJSON(editingTask.updated)) :
                    'just now'}
                </Typography>
            </Tooltip>
            <FooterRight>
                {{
                    [SavingStates.UNCHANGED]: null,
                    [SavingStates.MODIFIED]: <CircularProgress color="inherit" size={20}/>,
                    [SavingStates.SAVED]:
                        <Zoom
                            in={saving === SavingStates.SAVED}>
                            <CheckIcon/>
                        </Zoom>,
                }[saving]}
                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={handleClose}>
                    Close
                </Button>
            </FooterRight>
        </Footer>}
    >
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
                autoSave()
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
                    autoSave()
                }}
            />
            : <MarkdownEditor
                defaultValue={getValues('notes')}
                onChange={newVal => {
                    setValue('notes', newVal);
                    autoSave()
                }}/>
        }
    </DialogBlurResponsive>
};
