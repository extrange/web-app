import React from 'react'
import './editTask.css'
import {StyledTextField} from "../../../components/common";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import {useInput} from "../../../util";
import muiStyled from "@material-ui/core/styles/styled"

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const InputContainer = styled.div`
    max-width: 500px;
`;

const StyledButton = muiStyled(Button)({
    margin: '10px'
});

export const EditTask = props => {
    const initialTitle = props.editingTask['title'];
    const initialNotes = props.editingTask['notes'];

    const {values, bind} = useInput({
        title: initialTitle,
        notes: initialNotes,
    });


    const handleSubmit = event => {
        let id = props.editingTask['id'];
        let tasklist = props.editingTask['tasklist'];

        if (id === null)
            props.createTask(tasklist, values.title, values.notes);
        else
            props.updateTask(id, tasklist, values.title, values.notes);

        event.preventDefault();
    };

    const handleCancelEdit = event => {
        if (values.title !== initialTitle || values.notes !== initialNotes) {
            if (!window.confirm('Discard changes?')) {
                return
            }
        }
        props.onCancelEdit()
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

            <StyledTextField
                name='notes'
                label='Notes'
                multiline
                fullWidth
                {...bind('notes')}
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
    );
};
