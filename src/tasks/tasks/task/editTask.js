import React, {useState} from 'react'
import {StyledTextField} from "../../../components/common";
import styled from "styled-components";
import {useInput} from "../../../util";
import muiStyled from "@material-ui/core/styles/styled"
import {MarkdownEditor} from "../../../components/markdownEditor";
import {Button, Dialog, DialogActions, DialogTitle} from "@material-ui/core";

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

    const {values, setValue, bind} = useInput({
        title: initialTitle,
        notes: initialNotes,
    });


    const handleSubmit = event => {
        let id = editingTask['id'];
        let tasklist = editingTask['tasklist'];

        if (id === null)
            createTask(tasklist, values.title, values.notes);
        else
            updateTask(id, tasklist, values.title, values.notes);

        event.preventDefault();
    };

    const handleCancelEdit = () => {
        if (values.title !== initialTitle || values.notes !== initialNotes) {
            setDialogOpen(true)
        } else
            onCancelEdit()
    };

    const handleDiscard = () => {
        setDialogOpen(false);
        onCancelEdit()
    };

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
                {...bind('title')}
            />

            <MarkdownEditor
                value={values.notes}
                setValue={value => setValue({name: 'notes', value})}
            />

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
