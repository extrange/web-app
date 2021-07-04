import { DialogBlurResponsive } from "../../shared/components/DialogBlurResponsive";
import React, { useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogTitle, TextField, Typography } from "@material-ui/core";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete } from "@material-ui/lab";
import { mapGenres } from "./utils";
import { useGetGenresQuery } from "./literatureApi";

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
/*Todo consider using 'genres' as an object instead of array for improved performance*/
export const GenreEdit = ({
    editingItem: { id, name, notes, parent },
    closeEdit,
    isItemEmpty,
    itemIdField,
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
}) => {

    const { data: genres } = useGetGenresQuery()
    const [createGenre] = createItemMutation()
    const [updateGenre] = updateItemMutation()
    const [deleteGenre] = deleteItemMutation()

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [saveDialog, setSaveDialog] = useState(false)

    const genresWithNull = useMemo(() => {
        let arr = [
            {
                ancestors: [],
                fullName: '<Top Level>',
                id: null,
                name: '<Top Level>',
                parent: null
            },
            ...genres.map(e => mapGenres(e, genres)),
        ].sort((a, b) => a.fullName.localeCompare(b.fullName))

        /* Don't allow a genre to have itself as the parent */
        let ownIdx = arr.findIndex(e => e.id === id)
        if (ownIdx !== -1) arr.splice(ownIdx, 1)
        return arr
    }, [genres, id])

    const {
        control,
        handleSubmit,
        formState: {
            isDirty
        },
    } = useForm({
        defaultValues: {
            name,
            notes,
            parent: genresWithNull.find(e => e.id === parent) || genresWithNull[0],
        }
    });



    const onCloseCheckDirty = () => isDirty ? setSaveDialog(true) : closeEdit()
    const parseData = ({ parent, ...data }) => ({ parent: parent.id, ...data })
    const onSubmit = () => {
        handleSubmit(data => id ?
            updateGenre({ id, ...parseData(data) }) :
            createGenre(parseData(data))
        )()
        closeEdit()
    }

    const footer = (
        <StyledFooter>
            <StyledDiv />
            {id && <Button onClick={() => setDeleteDialog(true)}>Delete</Button>}
            <Button 
            onClick={onSubmit}
            color={'primary'}>
                Submit
            </Button>
        </StyledFooter>
    )


    return <>
        <Dialog
            open={saveDialog}
            onClose={() => setSaveDialog(false)}>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogActions>
                <Button onClick={closeEdit}>Discard</Button>
                <Button onClick={() => setSaveDialog(false)} color={'primary'}>Cancel</Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={deleteDialog}
            onClose={() => setDeleteDialog(false)}>
            <DialogTitle>Delete '{name}'?</DialogTitle>
            <DialogActions>
                <Button onClick={() => {
                    deleteGenre({id})
                    closeEdit()
                }}>Delete</Button>
                <Button onClick={() => setDeleteDialog(false)} color={'primary'}>Cancel</Button>
            </DialogActions>
        </Dialog>
        <DialogBlurResponsive
            open
            onClose={onCloseCheckDirty}
            footer={footer}>

            <FormContainer>

                <Controller
                    name={'name'}
                    control={control}
                    render={({ field: { ref, ...field } }) =>
                        <StyledTextField
                            {...field}
                            autoFocus
                            label={'Name'}
                            variant={'outlined'} />} />

                <Controller
                    name={'notes'}
                    control={control}
                    render={({ field: { ref, ...field } }) =>
                        <StyledTextField
                            {...field}
                            label={'Notes'}
                            variant={'outlined'} />} />

                <Controller
                    name={'parent'}
                    control={control}
                    render={({ field: { ref, onChange, ...field } }) =>
                        <Autocomplete
                            {...field}
                            disableClearable
                            getOptionLabel={e => e.name}
                            getOptionSelected={(opt, val) => opt.id === val.id}
                            groupBy={e => e.ancestors.length ? e.ancestors.join(' > ') : ''}
                            onChange={(event, value) => onChange(value)}
                            options={genresWithNull}
                            renderInput={params => <TextField label={'Parent'} {...params} variant={'outlined'} />}
                            renderOption={e => e.ancestors.length ?
                                <Typography style={{ marginLeft: '20px' }}>{e.name}</Typography> : e.name}
                        />} />

            </FormContainer>

        </DialogBlurResponsive>
    </>
};