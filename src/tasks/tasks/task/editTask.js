import React from 'react'
import {StyledTextField} from "../../../components/common";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import {useInput} from "../../../util";
import muiStyled from "@material-ui/core/styles/styled"
import {MarkdownEditor} from "../../../components/markdownEditor";

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

    const {values, setValue, bind} = useInput({
        title: initialTitle,
        notes: initialNotes,
    });

    let isMarkdownDocument = false;

    // If [MD] is present anywhere, identify as a markdown document
    if (values.title?.includes('[MD]'))
        isMarkdownDocument = true;


    const handleSubmit = event => {
        let id = editingTask['id'];
        let tasklist = editingTask['tasklist'];

        if (id === null)
            createTask(tasklist, values.title, values.notes);
        else
            updateTask(id, tasklist, values.title, values.notes);

        event.preventDefault();
    };

    const handleCancelEdit = event => {
        if (values.title !== initialTitle || values.notes !== initialNotes) {
            if (!window.confirm('Discard changes?')) {
                return
            }
        }
        onCancelEdit()
    };

    return (
        <InputContainer>
            <StyledTextField
                label='Title'
                multiline
                fullWidth
                autoFocus
                {...bind('title')}
            />
            {isMarkdownDocument ?
            <MarkdownEditor
                value={values.notes}
                setValue={value => setValue({name: 'notes', value})}
            />:
            <StyledTextField
                label={'Notes'}
                multiline
                fullWidth
                {...bind('notes')}
            />}

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
    );
};
