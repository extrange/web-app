import React, {useState} from 'react';
import * as Url from "./urls";
import {getGoodreadsBookInfo, getGoogleBookInfo} from "./urls";
import styled from "styled-components";
import SearchIcon from '@material-ui/icons/Search';
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
import {SearchBooks} from "./searchBooks";
import {sanitizeString} from "../../util/util";
import {
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    Snackbar
} from "@material-ui/core";
import {mergeWith} from "lodash";
import {DialogBlurResponsive} from "../../shared/dialogBlurResponsive";
import {Alert} from "@material-ui/lab";
import {useAsyncError} from "../../util/useAsyncError";
import {AutocompleteWithCreate} from "../../shared/autocompleteWithCreate";
import {TextFieldClearable} from "../../shared/textFieldClearable";
import {TextFieldMultilineEllipsis} from "../../shared/textFieldMultilineEllipsis";
import {ControlHelper} from "../../shared/controlHelper";
import {Networking} from "../../util/networking";

const FieldContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 10px;
  overflow: auto;
`;

const FooterDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`

const StyledTextFieldClearable = styled(TextFieldClearable)`
  margin: 5px 0;
`

const StyledAutocompleteWithCreate = styled(AutocompleteWithCreate)`
  margin: 5px 0;
`

const StyledKeyboardDatePicker = styled(KeyboardDatePicker)`
  margin: 5px 0;
`

const StyledTextFieldMultilineEllipsis = styled(TextFieldMultilineEllipsis)`
  margin: 5px 0;
`

const StyledDialogBlurResponsive = styled(DialogBlurResponsive)`
  .MuiDialog-paper {
    width: min(100vw - 32px, 800px);
  }
`


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
        trigger,
        formState: {
            isDirty,
            errors
        }
    } = useForm({
        resolver: yupResolver(YUP_SCHEMA),
        defaultValues: bookData ? transformFromServer(bookData, {authors, genres, types}) : DEFAULT_BOOK_VALUES,
        mode: 'onTouched',
    });

    const [searchOpen, setSearchOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [errorSnackbar, setErrorSnackbar] = useState(false);
    const [saveDialog, setSaveDialog] = useState(false);

    const onClear = name => () => setValue(name, DEFAULT_BOOK_VALUES[name]);
    const setError = useAsyncError()

    const onSubmit = handleSubmit(
        data => {
            if (!isDirty ||
                /*Untouched form, guaranteed no changes*/

                /*Editing book, no actual changes made*/
                (bookData && isBookDataEqual(bookData, transformToServer(data)))) {
                setAddedSnackbar({message: 'No changes were detected'})
                onClose()
                return
            }

            let transformedData = transformToServer(data)

            if (bookData) {
                /* Changes were made in editing book*/
                Url.updateBook(transformedData, bookData['id'])
                    .then(() => {
                        getBooks();
                        setAddedSnackbar({message: 'Changes saved'})
                        onClose()
                    })
                    .catch(setError);
            } else {
                /*User is adding book*/
                Url.addBook(transformedData)
                    .then(() => {
                        getBooks();
                        setAddedSnackbar({message: 'Book added'})
                        onClose()
                    })
                    .catch(setError);
            }
        },
        () => {
            setErrorSnackbar(true)
        })


    const onSearch = event => {
        if (event.key !== 'Enter' || !getValues(BOOK_FIELDS.title)) return;
        setLoadingSearch(true);
        Networking.send(`${Url.SEARCH}?q=${getValues(BOOK_FIELDS.title)}`, {method: 'GET',})
            .then(resp => resp.json())
            .then(json => {
                setResults(json['results']);
                setLoadingSearch(false);
                setSearchOpen(true)
            });
    };

    // Handle book result click
    const handleClick = result => {
        setLoadingSearch(true);
        let type = result.from;
        let request;
        if (type === 'google') {
            // Use ISBN_13 if available, otherwise ISBN_10
            request = getGoogleBookInfo(result.ISBN_13 || result.ISBN_10)
        } else {
            request = getGoodreadsBookInfo(result.goodreads_work_id, result.goodreads_book_id)
        }
        setSearchOpen(false);
        request.then(r => {
            let mergedResult = mergeWith({}, result, r,
                //preferentially choose srcVal over existing values if both present
                (objVal, srcVal) => srcVal || objVal);

            let authorsToAdd = []; // [] of {id, name, notes}
            let authorsToCreate = []; // [] of String

            mergedResult.authors.forEach(e => {
                //todo EXTREMELY INEFFICIENT
                let val = authors.find(author => sanitizeString(author.name) === sanitizeString(e));
                if (val) {
                    // Author already exists
                    authorsToAdd.push(val)
                } else {
                    // Author doesn't exist, to create
                    authorsToCreate.push(e)
                }
            });

            // Add all current values first

            setValue(BOOK_FIELDS.authors, authorsToAdd);
            [
                BOOK_FIELDS.description,
                BOOK_FIELDS.google_id,
                BOOK_FIELDS.goodreads_book_id,
                BOOK_FIELDS.image_url,
                BOOK_FIELDS.published,
                BOOK_FIELDS.title,
                BOOK_FIELDS.series,
                BOOK_FIELDS.series_position,
            ].forEach(e => setValue(e, mergedResult[e] || getValues(e)));

            Promise.all(authorsToCreate.map(name => Url.addAuthor({name: name})))
                .then(r => {
                    setValue(BOOK_FIELDS.authors, [...authorsToAdd, ...r]);
                    getAuthors();
                });

            setLoadingSearch(false);
            trigger()
        });
    };

    const handleDiscard = () => isDirty ?
        setSaveDialog(true) :
        onClose() //Untouched form


    const footer = <FooterDiv>
        <Button onClick={handleDiscard}>Discard</Button>
        <Button onClick={onSubmit} color={'primary'}> Save </Button>
    </FooterDiv>

    return <StyledDialogBlurResponsive
        open
        footer={footer}
        disableBackdropClick
        onBackdropClick={handleDiscard}
    >
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
        <Dialog
            open={saveDialog}
            onClose={() => setSaveDialog(false)}
        >
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogActions>
                <Button onClick={() => {
                    setAddedSnackbar({message: 'Changes discarded'})
                    onClose()
                }}> Discard </Button>
                <Button onClick={onSubmit} color={'primary'}> Save </Button>
            </DialogActions>
        </Dialog>
        <FieldContainer>
            <SearchBooks
                open={searchOpen}
                close={() => setSearchOpen(false)}
                results={results}
                handleClick={handleClick}
            />

            <ControlHelper
                name={BOOK_FIELDS.title}
                control={control}
                Component={StyledTextFieldMultilineEllipsis}

                errors={errors}
                label={'Title'}
                placeholder={'Search or enter book title'}
                onKeyPress={onSearch}
                InputProps={{
                    startAdornment:
                        <InputAdornment position={"start"}>
                            <SearchIcon/>
                        </InputAdornment>,
                    endAdornment:
                        <InputAdornment position={'end'}>
                            {loadingSearch && <CircularProgress size={20}/>}
                        </InputAdornment>
                }}
                onClear={onClear(BOOK_FIELDS.title)}
                variant={'outlined'}
            />

            <Controller
                name={BOOK_FIELDS.authors}
                control={control}
                render={({onChange, onBlur, value, name}) => <StyledAutocompleteWithCreate
                    autoComplete
                    autoHighlight
                    createOption={e => Url.addAuthor({name: e})}
                    filterSelectedOptions
                    getOptionLabel={e => e.name}
                    getOptions={getAuthors}
                    getOptionSelected={(option, value) => option.id === value.id}
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
                    value={value}
                />}
            />

            <Controller
                name={BOOK_FIELDS.genres}
                control={control}
                render={({onChange, onBlur, value, name}) => <StyledAutocompleteWithCreate
                    autoComplete
                    autoHighlight
                    createOption={e => Url.addGenre({name: e})}
                    filterSelectedOptions
                    getOptionLabel={e => e.name}
                    getOptions={getGenres}
                    getOptionSelected={(option, value) => option.id === value.id}
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
                    value={value}
                />}
            />

            <Controller
                name={BOOK_FIELDS.type}
                control={control}
                render={({onChange, onBlur, value, name}) => <StyledAutocompleteWithCreate
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
                    value={value}
                />}
            />

            <ControlHelper
                name={BOOK_FIELDS.description}
                label={'Description'}
                errors={errors}
                Component={StyledTextFieldMultilineEllipsis}
                control={control}
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
                    Component={StyledKeyboardDatePicker}

                    autoOk
                    disableFuture
                    format={'dd/MM/yyyy'}
                    placeholder={'dd/mm/yyyy'}
                    inputVariant={'outlined'}
                    variant={'inline'}
                />
            </MuiPickersUtilsProvider>

            <ControlHelper
                name={BOOK_FIELDS.image_url}
                errors={errors}
                label={'Image URL'}
                Component={StyledTextFieldClearable}
                control={control}
                onClear={onClear(BOOK_FIELDS.image_url)}

                type={'url'}
                variant={'outlined'}
            />

            <ControlHelper
                name={BOOK_FIELDS.published}
                label={'Year Published'}
                control={control}
                Component={StyledTextFieldClearable}
                errors={errors}

                type={'tel'}
                onClear={onClear(BOOK_FIELDS.published)}
                variant={'outlined'}
            />

            <ControlHelper
                name={BOOK_FIELDS.google_id}
                label={'Google ID'}
                control={control}
                Component={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.google_id)}
                variant={'outlined'}
            />

            <ControlHelper
                name={BOOK_FIELDS.goodreads_book_id}
                label={'Goodreads ID'}
                control={control}
                Component={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.goodreads_book_id)}
                variant={'outlined'}
            />

            <ControlHelper
                name={BOOK_FIELDS.series}
                label={'Series Name'}
                control={control}
                Component={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.series)}
                variant={'outlined'}
            />

            <ControlHelper
                name={BOOK_FIELDS.series_position}
                label={'Series Position'}
                control={control}
                Component={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.series_position)}
                variant={'outlined'}
            />

            <ControlHelper
                name={BOOK_FIELDS.rating}
                label={'Rating'}
                control={control}
                Component={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.rating)}
                variant={'outlined'}
            />

            <ControlHelper
                name={BOOK_FIELDS.my_review}
                label={'My Review'}
                control={control}
                Component={StyledTextFieldMultilineEllipsis}
                errors={errors}

                placeholder={'Not good, read others, highlight specific chapters, etc'}
                multiline
                variant={'outlined'}
            />

            <ControlHelper
                name={BOOK_FIELDS.notes}
                label={'Notes'}
                control={control}
                Component={StyledTextFieldMultilineEllipsis}
                errors={errors}

                placeholder={'Specific edition, comments on metadata, somebody recommended me, want to buy etc'}
                multiline
                variant={'outlined'}
            />

        </FieldContainer>
    </StyledDialogBlurResponsive>
};
