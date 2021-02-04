import {StyledTextField} from "../../../components/common";
import styled from "styled-components";
import {MarkdownEditor} from "../../../components/markdownEditor";
import {Button, useMediaQuery} from "@material-ui/core";
import {useForm} from "react-hook-form";
import {useTheme} from "@material-ui/core/styles";
import {debounce} from 'lodash'
import {useCallback, useRef, useState} from "react";
import {isEmpty} from "../../../util";
import {DialogBlurResponsive} from "../../../components/dialogBlurResponsive";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SavingStates = {
    UNCHANGED: 1,
    MODIFIED: 2,
    SAVED: 3
};

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

    register({name: 'title'});
    register({name: 'notes'});

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
        footer={<ButtonContainer>
            {{
                [SavingStates.UNCHANGED]: '',
                [SavingStates.MODIFIED]: 'Saving...',
                [SavingStates.SAVED]: 'Changes saved'
            }[saving]}
            <Button
                variant={'text'}
                color={'primary'}
                onClick={handleClose}
            > Close
            </Button>

        </ButtonContainer>}
    >
        <StyledTextField
            label='Title'
            multiline
            fullWidth
            name={'title'}
            autoFocus={!initialTitle && !initialNotes}
            defaultValue={initialTitle}
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
