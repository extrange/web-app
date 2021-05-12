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

export const GenericAddDeleteCreateDialog = ({
                                                 onClose,
                                                 onSubmit,
                                                 editingItem: {id, name, notes}
                                             }) => {

    const {register, handleSubmit} = useForm({
        defaultValues: {
            name,
            notes,
        }
    })

    const footer = <StyledFooter>
        <StyledDiv/>
        <Button onClick={() => handleSubmit(data => onSubmit(data, id))()
        }>Submit</Button>
    </StyledFooter>

    return <DialogBlurResponsive
        open
        onClose={onClose}
        footer={footer}
    >
        <FormContainer>
            <StyledTextField
                label={'Name'}
                name={'name'}
                inputRef={register}
                variant={'outlined'}
            />

            <StyledTextField
                label={'Notes'}
                name={'notes'}
                inputRef={register}
                variant={'outlined'}
            />
        </FormContainer>

    </DialogBlurResponsive>
}