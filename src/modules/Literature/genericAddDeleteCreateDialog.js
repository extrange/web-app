import {DialogBlurResponsive} from "../../common/dialogBlurResponsive";
import React from "react";
import {Button, TextField} from "@material-ui/core";
import styled from "styled-components";
import {Controller, useForm} from "react-hook-form";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const StyledFooter = styled.div`
  display: flex;
  align-content: flex-end;
`;

const StyledTextField = styled(TextField)`
  margin: 10px 0;
`;

const StyledDiv = styled.div`
  flex: 1
`;

export const GenericAddDeleteCreateDialog = ({
                                                 onClose,
                                                 onSubmit,
                                                 editingItem: {id, name, notes}
                                             }) => {

    const {
        control,
        handleSubmit
    } = useForm({
        defaultValues: {
            name,
            notes,
        }
    });

    const footer = <StyledFooter>
        <StyledDiv/>
        <Button onClick={() => handleSubmit(data => onSubmit(data, id))()
        }>Submit</Button>
    </StyledFooter>;

    return <DialogBlurResponsive
        open
        onClose={onClose}
        footer={footer}>

        <FormContainer>

            <Controller
                name={'name'}
                control={control}
                render={({field: {ref, ...field}}) =>
                    <StyledTextField
                        {...field}
                        label={'Name'}
                        variant={'outlined'}/>}/>

            <Controller
                name={'notes'}
                control={control}
                render={({field: {ref, ...field}}) =>
                    <StyledTextField
                        {...field}
                        label={'Notes'}
                        variant={'outlined'}/>}/>

        </FormContainer>

    </DialogBlurResponsive>
};