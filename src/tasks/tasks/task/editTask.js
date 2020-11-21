import React, {useEffect, useRef, useState} from 'react'
import {StyledTextField} from "../../../components/common";
import styled from "styled-components";
import muiStyled from "@material-ui/core/styles/styled"
import {MarkdownEditor} from "../../../components/markdownEditor";
import {Button, Dialog, DialogActions, DialogTitle} from "@material-ui/core";
import {useForm} from "react-hook-form";
import Hidden from "@material-ui/core/Hidden";
import {withSetDefaultValueOnMount} from "../../../components/withSetDefaultValueOnMount";

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const InputContainer = styled.div`
    margin: 0 auto;
    max-width: 800px;
`;

const StyledButton = muiStyled(Button)({
    margin: '10px'
});

export const EditTask = ({editingTask, createTask, updateTask, onCancelEdit}) => {

    const initialTitle = editingTask['title'];
    const initialNotes = editingTask['notes'];

    const [dialogOpen, setDialogOpen] = useState(false);

    const {register, getValues, setValue} = useForm({
        defaultValues: {
            'title': initialTitle,
            'notes': initialNotes,
        }
    });

    register({name: 'title'});
    register({name: 'notes'});

    const titleRef = useRef();

    // Autofocus if both title and notes are empty
    useEffect(() => {
        if (!initialTitle && !initialNotes)
            titleRef.current.focus()
        // eslint-disable-next-line
    }, []);


    const handleSubmit = event => {
        let id = editingTask['id'];
        let tasklist = editingTask['tasklist'];
        let {title, notes} = getValues();

        //Do not trigger submission if nothing was changed
        if (title === initialTitle && notes === initialNotes) {
            onCancelEdit();
            return;
        }

        if (id === null)
            createTask(tasklist, title, notes);
        else
            updateTask(id, tasklist, title, notes);

        event.preventDefault();
    };

    const handleCancelEdit = () => {
        let {title, notes} = getValues();
        if (title !== initialTitle || notes !== initialNotes) {
            setDialogOpen(true)
        } else
            onCancelEdit()
    };

    const handleDiscard = () => {
        setDialogOpen(false);
        onCancelEdit()
    };

    const UncontrolledStyledTextField = withSetDefaultValueOnMount(StyledTextField);
    const UncontrolledMarkdownEditor = withSetDefaultValueOnMount(MarkdownEditor);

    return <>
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
        >
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogActions>
                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={() => setDialogOpen(false)}
                >Cancel
                </Button>

                <Button
                    variant={'text'}
                    color={'primary'}
                    onClick={handleDiscard}
                >Discard
                </Button>
            </DialogActions>

        </Dialog>
        <InputContainer>

            <StyledTextField
                label='Title'
                multiline
                fullWidth
                name={'title'}
                inputRef={titleRef}
                defaultValue={initialTitle}
                onChange={e => setValue('title', e.target.value)}
            />


            <Hidden mdUp>
                <UncontrolledStyledTextField
                    label='Notes'
                    multiline
                    fullWidth
                    getInitialValue={() => getValues('notes')}
                    onChange={newVal => setValue('notes', newVal.target.value)}
                />
            </Hidden>

            <Hidden smDown>
                <UncontrolledMarkdownEditor
                    getInitialValue={() => getValues('notes')}
                    onChange={newVal => setValue('notes', newVal)}
                />
            </Hidden>


            <ButtonContainer>

                <StyledButton
                    variant={'outlined'}
                    color={'primary'}
                    onClick={handleCancelEdit}
                > Cancel
                </StyledButton>

                <StyledButton
                    variant={'contained'}
                    color={'primary'}
                    onClick={handleSubmit}
                >Submit
                </StyledButton>

            </ButtonContainer>
        </InputContainer>
    </>
};
