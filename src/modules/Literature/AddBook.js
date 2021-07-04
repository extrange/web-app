import DateFns from '@date-io/date-fns';
import { yupResolver } from "@hookform/resolvers/yup";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormHelperText,
    IconButton,
    Snackbar,
    Typography
} from "@material-ui/core";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Alert } from "@material-ui/lab";
import { KeyboardDatePicker } from "@material-ui/pickers/DatePicker";
import { MuiPickersUtilsProvider } from "@material-ui/pickers/MuiPickersUtilsProvider";
import { isEmpty } from "lodash";
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from "styled-components";
import { AutocompleteWithCreate } from "../../shared/components/AutocompleteWithCreate";
import { DialogBlurResponsive } from "../../shared/components/DialogBlurResponsive";
import { TextFieldClearable } from "../../shared/components/textFieldClearable";
import { TextFieldMultilineEllipsis } from "../../shared/components/textFieldMultilineEllipsis";
import { useCreateAuthorMutation, useCreateBookMutation, useCreateGenreMutation, useCreateTypeMutation, useGetAuthorsQuery, useGetGenresQuery, useGetTypesQuery, useUpdateBookMutation } from './literatureApi';
import {
    BOOK_FIELDS,
    DEFAULT_BOOK_VALUES,
    isBookDataEqual,
    transformFromServer,
    transformToServer,
    YUP_SCHEMA
} from "./schema";
import { mapGenres } from "./utils";

const FieldContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-areas: 
    "${BOOK_FIELDS.title} ${BOOK_FIELDS.title}"
    "${BOOK_FIELDS.authors} ${BOOK_FIELDS.type}"
    "${BOOK_FIELDS.description} ${BOOK_FIELDS.description}"
    "${BOOK_FIELDS.genres} ${BOOK_FIELDS.read_next}"
    "${BOOK_FIELDS.rating} ${BOOK_FIELDS.date_read} "
    "${BOOK_FIELDS.image_url} ${BOOK_FIELDS.published}"
    "${BOOK_FIELDS.google_id} ${BOOK_FIELDS.goodreads_book_id}"
    "${BOOK_FIELDS.series} ${BOOK_FIELDS.series_position}"
    "${BOOK_FIELDS.my_review} ${BOOK_FIELDS.my_review}"
    "${BOOK_FIELDS.notes} ${BOOK_FIELDS.notes}";
  gap: 20px 10px;
  margin: 10px;
`;

const ButtonFlexDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const AddBook = ({
    bookData,
    onClose,
    setAddedSnackbar
}) => {

    /* Books.js will prevent AddBook.js displaying until these queries have loaded initially,
    so they're guaranteed to be defined */
    const { data: authors } = useGetAuthorsQuery()
    const { data: genres } = useGetGenresQuery()
    const { data: types } = useGetTypesQuery()

    const [createBook] = useCreateBookMutation()
    const [updateBook] = useUpdateBookMutation()
    const [createAuthor] = useCreateAuthorMutation()
    const [createGenre] = useCreateGenreMutation()
    const [createType] = useCreateTypeMutation()

    const {
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: {
            isDirty
        },
        watch
    } = useForm({
        resolver: yupResolver(YUP_SCHEMA),
        defaultValues: isEmpty(bookData) ? DEFAULT_BOOK_VALUES : transformFromServer(bookData, {
            authors,
            genres,
            types
        }),
        mode: 'onTouched',
    });

    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const [saveDialog, setSaveDialog] = useState(false);
    const [infoDialog, setInfoDialog] = useState(false);

    const sortedGenres = genres.map(e => mapGenres(e, genres)).sort((a, b) => a.fullName.localeCompare(b.fullName))

    const onSubmit = handleSubmit(
        data => {
            if (!isDirty ||
                /*Untouched form, guaranteed no changes*/

                /*Editing book, no actual changes made*/
                (!isEmpty(bookData) && isBookDataEqual(bookData, transformToServer(data)))) {
                setAddedSnackbar({ message: 'No changes were detected' });
                onClose();
                return
            }

            let transformedData = transformToServer(data);

            if (isEmpty(bookData) || !('id' in bookData)) {
                /*User is adding book*/
                createBook(transformedData)
                    .unwrap()
                    .then(() => {
                        setAddedSnackbar({ message: 'Book added' });
                    })
                onClose()
            } else {
                /* Changes were made in editing book*/
                updateBook({ id: bookData['id'], ...transformedData })
                    .unwrap()
                    .then(() => {
                        setAddedSnackbar({ message: 'Changes saved' });
                    })
                }
                onClose()
        },
        () => {
            setErrorSnackbar(true)
        });


    const handleDiscard = () => isDirty ?
        setSaveDialog(true) :
        onClose(); //Untouched form


    const footer = <ButtonFlexDiv>
        <IconButton
            tabIndex={-1}
            onClick={() => setInfoDialog(true)}>
            <InfoOutlinedIcon />
        </IconButton>
        <Button onClick={handleDiscard}>Discard</Button>
        <Button onClick={onSubmit} color={'primary'}> Save </Button>
    </ButtonFlexDiv>;

    const StandardField = useCallback(({ Component, name, label, getComponentProps = () => ({}), ...props }) =>
        <Controller
            control={control}
            name={name}
            render={controllerProps => {
                const { field: { ref, ...field }, fieldState: { error } } = controllerProps
                return <Component
                    error={Boolean(error)}
                    label={label}
                    helperText={error?.message}
                    size={'small'}
                    style={{ gridArea: field.name }}
                    variant={'outlined'}
                    {...props}
                    {...field}
                    {...getComponentProps({ ...controllerProps, label })} />
            }} />, [control])

    return <>
        <Dialog
            open={saveDialog}
            onClose={() => setSaveDialog(false)}>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogActions>
                <Button onClick={() => {
                    setAddedSnackbar({ message: 'Changes discarded' });
                    onClose()
                }}> Discard </Button>
                <Button onClick={() => setSaveDialog(false)} color={'primary'}>Cancel</Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={infoDialog}
            onClose={() => setInfoDialog(false)}>
            <DialogTitle>Notes on fields</DialogTitle>
            <DialogContent>
                <DialogContentText component={'div'}>
                    Series:
                    <ul>
                        <li>For new ones I wish to read, just store the first book.</li>
                        <li>If I like it, add just the next book (read_next=true)</li>
                        <li>As I complete each book in the series, it is added.</li>
                        <li>If I don't like it halfway, I don't add any further books (i.e. the series is left
                            hanging)
                        </li>
                        <li>Series which I have completed should have all books added.</li>
                    </ul>

                    Authors with many works:
                    <ul>
                        <li>The anthology is listed, if I plan to read it</li>
                        <li>All works I have read/wish to read are also listed.</li>
                        <li>I could also make comments in the author object's notes.</li>
                    </ul>

                    Unknown read date
                    <ul>
                        <li>put as 01/01/2000</li>
                    </ul>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setInfoDialog(false)}>
                    Close
                </Button>
            </DialogActions>

        </Dialog>
        <Snackbar
            open={errorSnackbar}
            onClose={() => setErrorSnackbar(false)}
            autoHideDuration={3000}>
            <Alert
                severity={'error'}
                onClose={() => setErrorSnackbar(false)}>
                Check errors before submitting
            </Alert>
        </Snackbar>
        <DialogBlurResponsive
            open
            footer={footer}
            disableBackdropClick
            onBackdropClick={handleDiscard}>
            <FieldContainer>

                <StandardField
                    name={BOOK_FIELDS.title}
                    label={'Title'}
                    Component={TextFieldMultilineEllipsis} />

                <StandardField
                    name={BOOK_FIELDS.authors}
                    label={'Authors'}
                    Component={AutocompleteWithCreate}

                    autoComplete
                    autoHighlight
                    createOption={name => createAuthor({ name }).unwrap()}
                    filterSelectedOptions
                    getComponentProps={({ field: { name }, fieldState: { error }, label }) => ({
                        getValue: () => getValues(name),
                        renderProps: {
                            label,
                            variant: 'outlined',
                            error: Boolean(error),
                            helperText: error ? 'Creating author(s)...' : null
                        }
                    })}
                    getOptionLabel={e => e.name}
                    getOptionSelected={(option, value) => option.id === value.id}
                    multiple={true}
                    options={authors}
                />

                <StandardField
                    name={BOOK_FIELDS.type}
                    label={'Type'}
                    Component={AutocompleteWithCreate}

                    autoComplete
                    autoHighlight
                    createOption={name => createType({ name }).unwrap()}
                    filterSelectedOptions
                    getComponentProps={({field: { name }, fieldState: { error }, label }) => ({
                        getValue: () => getValues(name),
                        renderProps: {
                            label,
                            variant: 'outlined',
                            error: Boolean(error),
                            helperText: error?.message
                        }
                    })}
                    getOptionLabel={e => e.name}
                    getOptionSelected={(option, value) => option.id === value.id}
                    maxOptionsToShow={0}
                    multiple={false}
                    options={types} />

                <StandardField
                    name={BOOK_FIELDS.description}
                    label={'Description'}
                    Component={TextFieldMultilineEllipsis} />

                {/*todo Very hacky. Write this better*/}
                <StandardField
                    name={BOOK_FIELDS.genres}
                    label={'Genres'}
                    Component={AutocompleteWithCreate}

                    autoComplete
                    autoHighlight
                    createOption={name => createGenre({ name }).unwrap()}
                    filterSelectedOptions
                    getComponentProps={({ field: { name }, fieldState: { error }, label }) => ({
                        getValue: () => getValues(name),
                        renderProps: {
                            label,
                            variant: 'outlined',
                            error: Boolean(error),
                            helperText: error ? 'Creating genre(s)...' : null
                        }
                    })}
                    getOptionLabel={e => e.name}
                    getOptionSelected={(option, value) => option.id === value.id}
                    groupBy={e => e.ancestors?.length ? e.ancestors.join(' > ') : ''}
                    maxOptionsToShow={0}
                    multiple={true}
                    options={sortedGenres}
                    renderOption={e => e.ancestors?.length ?
                        <Typography style={{ marginLeft: '20px' }}>{e.name}</Typography> : (e.name || `Add '${e._name}'`)}

                />

                <Controller
                    name={BOOK_FIELDS.read_next}
                    control={control}
                    render={({
                        field: { onChange, value, ...field },
                        fieldState: { error },
                    }) => <>
                            <FormControlLabel
                                {...field}
                                checked={value}
                                control={<Checkbox />}
                                label={'Read next?'}
                                labelPlacement={'end'}
                                onChange={e => {
                                    setValue(BOOK_FIELDS.date_read, DEFAULT_BOOK_VALUES[BOOK_FIELDS.date_read])
                                    onChange(e)
                                }}
                                style={{ gridArea: field.name }}
                            />
                            <FormHelperText
                                error={Boolean(error)}>
                                {error?.message}
                            </FormHelperText>
                        </>} />

                <StandardField
                    name={BOOK_FIELDS.rating}
                    label={'Rating'}
                    Component={TextFieldClearable} />

                <MuiPickersUtilsProvider utils={DateFns}>
                    <StandardField
                        name={BOOK_FIELDS.date_read}
                        label={'Date Read'}
                        Component={KeyboardDatePicker}

                        autoOk
                        disabled={watch(BOOK_FIELDS.read_next)}
                        disableFuture
                        format={'dd/MM/yyyy'}
                        placeholder={'dd/mm/yyyy'}
                        inputVariant={'outlined'}
                    />

                </MuiPickersUtilsProvider>

                <StandardField
                    name={BOOK_FIELDS.image_url}
                    label={'Image URL'}
                    Component={TextFieldClearable}
                    type={'url'} />

                <StandardField
                    name={BOOK_FIELDS.published}
                    label={'Year Published'}
                    Component={TextFieldClearable} />

                <StandardField
                    name={BOOK_FIELDS.google_id}
                    label={'Google ID'}
                    Component={TextFieldClearable} />

                <StandardField
                    name={BOOK_FIELDS.goodreads_book_id}
                    label={'Goodreads ID'}
                    Component={TextFieldClearable} />

                <StandardField
                    name={BOOK_FIELDS.series}
                    label={'Series Name'}
                    Component={TextFieldClearable} />

                <StandardField
                    name={BOOK_FIELDS.series_position}
                    label={'Series Position'}
                    Component={TextFieldClearable} />

                <StandardField
                    name={BOOK_FIELDS.my_review}
                    label={'My Review'}
                    Component={TextFieldMultilineEllipsis}
                    placeholder={'Not good, read others, highlight specific chapters, etc'} />

                <StandardField
                    name={BOOK_FIELDS.notes}
                    label={'Notes'}
                    Component={TextFieldMultilineEllipsis}
                    placeholder={'Specific edition, comments on metadata, somebody recommended me, want to buy etc'} />

            </FieldContainer>
        </DialogBlurResponsive>
    </>
};
