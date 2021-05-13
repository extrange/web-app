import React, {useState} from 'react';
import * as Url from "./urls";
import styled from "styled-components";
import {KeyboardDatePicker} from "@material-ui/pickers/DatePicker";
import {MuiPickersUtilsProvider} from "@material-ui/pickers/MuiPickersUtilsProvider"
import DateFns from '@date-io/date-fns'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup";
import {
    BOOK_FIELDS,
    DEFAULT_BOOK_VALUES,
    isBookDataEqual,
    transformFromServer,
    transformToServer,
    YUP_SCHEMA
} from "./schema";
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
    Snackbar
} from "@material-ui/core";
import {isEmpty} from "lodash";
import {DialogBlurResponsive} from "../../shared/dialogBlurResponsive";
import {Alert} from "@material-ui/lab";
import {useAsyncError} from "../../util/useAsyncError";
import {AutocompleteWithCreate} from "../../shared/autocompleteWithCreate";
import {TextFieldClearable} from "../../shared/textFieldClearable";
import {TextFieldMultilineEllipsis} from "../../shared/textFieldMultilineEllipsis";
import {ControlHelper} from "../../shared/controlHelper";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

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
                            books,
                            setBooks,
                            authors,
                            setAuthors,
                            genres,
                            setGenres,
                            types,
                            setTypes,
                            getBooks,
                            getAuthors,
                            getGenres,
                            getTypes,

                            bookData,
                            onClose,
                            setAddedSnackbar
                        }) => {

    const {
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: {
            isDirty,
            errors
        }
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

    const onClear = name => () => setValue(name, DEFAULT_BOOK_VALUES[name], {shouldDirty: true});
    const setError = useAsyncError();

    const onSubmit = handleSubmit(
        data => {
            if (!isDirty ||
                /*Untouched form, guaranteed no changes*/

                /*Editing book, no actual changes made*/
                (!isEmpty(bookData) && isBookDataEqual(bookData, transformToServer(data)))) {
                setAddedSnackbar({message: 'No changes were detected'});
                onClose();
                return
            }

            let transformedData = transformToServer(data);

            if (isEmpty(bookData) || !('id' in bookData)) {
                /*User is adding book*/
                Url.addBook(transformedData)
                    .then(() => {
                        getBooks();
                        setAddedSnackbar({message: 'Book added'});
                        onClose()
                    })
                    .catch(setError);
            } else {
                /* Changes were made in editing book*/
                Url.updateBook(transformedData, bookData['id'])
                    .then(() => {
                        getBooks();
                        setAddedSnackbar({message: 'Changes saved'});
                        onClose()
                    })
                    .catch(setError);
            }
        },
        () => {
            setErrorSnackbar(true)
        });


    const handleDiscard = () => isDirty ?
        setSaveDialog(true) :
        onClose(); //Untouched form


    const footer = <ButtonFlexDiv>
        <IconButton
            onClick={() => setInfoDialog(true)}>
            <InfoOutlinedIcon/>
        </IconButton>
        <Button onClick={handleDiscard}>Discard</Button>
        <Button onClick={onSubmit} color={'primary'}> Save </Button>
    </ButtonFlexDiv>;

    return <>
        <Dialog
            open={saveDialog}
            onClose={() => setSaveDialog(false)}>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogActions>
                <Button onClick={() => {
                    setAddedSnackbar({message: 'Changes discarded'});
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
                <ControlHelper
                    name={BOOK_FIELDS.title}
                    control={control}
                    Component={TextFieldMultilineEllipsis}

                    errors={errors}
                    label={'Title'}
                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.title}}
                    variant={'outlined'}
                />

                <Controller
                    name={BOOK_FIELDS.authors}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <AutocompleteWithCreate
                        autoComplete
                        autoHighlight
                        createOption={e => Url.addAuthor({name: e})}
                        filterSelectedOptions
                        getOptionLabel={e => e.name}
                        getOptions={getAuthors}
                        getOptionSelected={(option, value) => option.id === value.id}
                        getValue={() => getValues(BOOK_FIELDS.authors)}
                        multiple={true}
                        name={name}
                        onBlur={onBlur}
                        onChange={onChange}
                        options={authors}
                        renderProps={{
                            label: 'Authors',
                            variant: 'outlined',

                            error: Boolean(errors[BOOK_FIELDS.authors]),
                            helperText: errors[BOOK_FIELDS.authors] ? 'Creating author(s)...' : null
                        }}
                        size={'small'}
                        style={{gridArea: BOOK_FIELDS.authors}}
                        value={value}
                    />}
                />

                <Controller
                    name={BOOK_FIELDS.genres}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <AutocompleteWithCreate
                        autoComplete
                        autoHighlight
                        createOption={e => Url.addGenre({name: e})}
                        filterSelectedOptions
                        getOptionLabel={e => e.name}
                        getOptions={getGenres}
                        getOptionSelected={(option, value) => option.id === value.id}
                        getValue={() => getValues(BOOK_FIELDS.genres)}
                        multiple={true}
                        name={name}
                        onBlur={onBlur}
                        onChange={onChange}
                        options={genres}
                        renderProps={{
                            label: 'Genres',
                            variant: 'outlined',

                            error: Boolean(errors[BOOK_FIELDS.genres]),
                            helperText: errors[BOOK_FIELDS.genres] ? 'Creating genre(s)...' : null
                        }}
                        size={'small'}
                        style={{gridArea: BOOK_FIELDS.genres}}
                        value={value}
                    />}
                />

                <Controller
                    name={BOOK_FIELDS.type}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <AutocompleteWithCreate
                        autoComplete
                        autoHighlight
                        createOption={e => Url.addType({name: e})}
                        filterSelectedOptions
                        getOptionLabel={e => e.name}
                        getOptions={getTypes}
                        getOptionSelected={(option, value) => option.id === value.id}
                        multiple={false}
                        name={name}
                        onBlur={onBlur}
                        onChange={onChange}
                        options={types}
                        renderProps={{
                            label: 'Type',
                            variant: 'outlined',

                            error: Boolean(errors[BOOK_FIELDS.type]),
                            helperText: errors[BOOK_FIELDS.type]?.message
                        }}
                        size={'small'}
                        style={{gridArea: BOOK_FIELDS.type}}
                        value={value}
                    />}
                />

                <ControlHelper
                    name={BOOK_FIELDS.description}
                    label={'Description'}
                    errors={errors}
                    Component={TextFieldMultilineEllipsis}
                    control={control}
                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.description}}
                    variant={'outlined'}
                />

                <Controller
                    name={BOOK_FIELDS.read_next}
                    control={control}
                    render={({onChange, onBlur, value, name}) =>
                        <FormControlLabel
                            checked={value}
                            control={<Checkbox/>}
                            label={'Read next?'}
                            labelPlacement={'end'}
                            name={name}
                            onBlur={onBlur}
                            onChange={e => onChange(e.target.checked)}
                            style={{gridArea: BOOK_FIELDS.read_next}}
                        />}
                />
                <FormHelperText
                    error={Boolean(errors[BOOK_FIELDS.read_next])}>
                    {errors[BOOK_FIELDS.read_next]?.message}
                </FormHelperText>


                <MuiPickersUtilsProvider utils={DateFns}>
                    <ControlHelper
                        name={BOOK_FIELDS.date_read}
                        label={'Date Read'}
                        control={control}
                        errors={errors}
                        Component={KeyboardDatePicker}

                        autoOk
                        disableFuture
                        format={'dd/MM/yyyy'}
                        placeholder={'dd/mm/yyyy'}
                        inputVariant={'outlined'}
                        size={'small'}
                        style={{gridArea: BOOK_FIELDS.date_read}}
                        variant={'inline'}
                    />
                </MuiPickersUtilsProvider>

                <ControlHelper
                    name={BOOK_FIELDS.image_url}
                    errors={errors}
                    label={'Image URL'}
                    Component={TextFieldClearable}
                    control={control}
                    onClear={onClear(BOOK_FIELDS.image_url)}

                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.image_url}}
                    type={'url'}
                    variant={'outlined'}
                />

                <ControlHelper
                    name={BOOK_FIELDS.published}
                    label={'Year Published'}
                    control={control}
                    Component={TextFieldClearable}
                    errors={errors}

                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.published}}
                    type={'tel'}
                    onClear={onClear(BOOK_FIELDS.published)}
                    variant={'outlined'}
                />

                <ControlHelper
                    name={BOOK_FIELDS.google_id}
                    label={'Google ID'}
                    control={control}
                    Component={TextFieldClearable}
                    errors={errors}
                    onClear={onClear(BOOK_FIELDS.google_id)}
                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.google_id}}
                    variant={'outlined'}
                />

                <ControlHelper
                    name={BOOK_FIELDS.goodreads_book_id}
                    label={'Goodreads ID'}
                    control={control}
                    Component={TextFieldClearable}
                    errors={errors}
                    onClear={onClear(BOOK_FIELDS.goodreads_book_id)}
                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.goodreads_book_id}}
                    variant={'outlined'}
                />

                <ControlHelper
                    name={BOOK_FIELDS.series}
                    label={'Series Name'}
                    control={control}
                    Component={TextFieldClearable}
                    errors={errors}
                    onClear={onClear(BOOK_FIELDS.series)}
                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.series}}
                    variant={'outlined'}
                />

                <ControlHelper
                    name={BOOK_FIELDS.series_position}
                    label={'Series Position'}
                    control={control}
                    Component={TextFieldClearable}
                    errors={errors}
                    onClear={onClear(BOOK_FIELDS.series_position)}
                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.series_position}}
                    variant={'outlined'}
                />

                <ControlHelper
                    name={BOOK_FIELDS.rating}
                    label={'Rating'}
                    control={control}
                    Component={TextFieldClearable}
                    errors={errors}
                    onClear={onClear(BOOK_FIELDS.rating)}
                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.rating}}
                    variant={'outlined'}
                />

                <ControlHelper
                    name={BOOK_FIELDS.my_review}
                    label={'My Review'}
                    control={control}
                    Component={TextFieldMultilineEllipsis}
                    errors={errors}

                    placeholder={'Not good, read others, highlight specific chapters, etc'}
                    multiline
                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.my_review}}
                    variant={'outlined'}
                />

                <ControlHelper
                    name={BOOK_FIELDS.notes}
                    label={'Notes'}
                    control={control}
                    Component={TextFieldMultilineEllipsis}
                    errors={errors}

                    placeholder={'Specific edition, comments on metadata, somebody recommended me, want to buy etc'}
                    multiline
                    size={'small'}
                    style={{gridArea: BOOK_FIELDS.notes}}
                    variant={'outlined'}
                />

            </FieldContainer>
        </DialogBlurResponsive>
    </>
};
