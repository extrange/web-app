import {DialogBlurResponsive} from "../../shared/dialogBlurResponsive";
import React from "react";
import {Button, TextField} from "@material-ui/core";
import styled from "styled-components";
import {useForm} from "react-hook-form";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`

const StyledFooter = styled.div`
  display: flex;
  align-content: flex-end;
`

const StyledTextField = styled(TextField)`
  margin: 10px 0;
`

const StyledDiv = styled.div`
  flex: 1
`

const StyledDialogBlurResponsive = styled(DialogBlurResponsive)`
  .MuiDialog-paper {
    width: min(100vw - 32px, 800px);
  }
`

export const PasswordDialog = ({
                                   onClose,
                                   onSubmit,
                                   editingItem: {id, title, username, password, notes}
                               }) => {

    const {register, handleSubmit} = useForm({
        defaultValues: {
            title,
            username,
            password,
            notes,
        }
    })

    const footer = <StyledFooter>
        <StyledDiv/>
        <Button onClick={() => handleSubmit(data => onSubmit(data, id))()}>
            Submit
        </Button>
    </StyledFooter>

    return <StyledDialogBlurResponsive
        open
        onClose={onClose}
        footer={footer}>
        <FormContainer>
            <StyledTextField
                label={'Title'}
                name={'title'}
                inputRef={register}
                variant={'outlined'}
            />

            <StyledTextField
                label={'Username'}
                name={'username'}
                inputRef={register}
                variant={'outlined'}
            />

            <StyledTextField
                label={'Password'}
                name={'password'}
                inputRef={register}
                variant={'outlined'}
            />

            <StyledTextField
                label={'Notes'}
                name={'notes'}
                inputRef={register}
                variant={'outlined'}
                multiline
            />
        </FormContainer>

    </StyledDialogBlurResponsive>
}