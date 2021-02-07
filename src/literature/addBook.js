import {useState} from 'react';
import {StyledButton, StyledTextField, StyledTextFieldClearable} from "../components/common";
import * as Url from "./urls";
import {getGoodreadsBookInfo, getGoogleBookInfo} from "./urls";
import styled from "styled-components";
import SearchIcon from '@material-ui/icons/Search';
import {KeyboardDatePicker} from "@material-ui/pickers/DatePicker";
import {MuiPickersUtilsProvider} from "@material-ui/pickers/MuiPickersUtilsProvider"
import DateFns from '@date-io/date-fns'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup";
import {BOOK_FIELDS, DEFAULT_BOOK_VALUES, isValidatedUserInputSame, transformBeforeSubmit, YUP_SCHEMA} from "./schema";
import {SearchBooks} from "./searchBooks";
import {Networking, sanitizeString} from "../util";
import {
    Checkbox,
    CircularProgress,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    Snackbar
} from "@material-ui/core";
import {mergeWith} from "lodash";
import {DialogBlurResponsive} from "../components/dialogBlurResponsive";
import {Alert} from "@material-ui/lab";
import {useAsyncError} from "../components/useAsyncError";
import {AutocompleteWithCreate} from "../components/autocompleteWithCreate";

const FieldContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 500px;
  margin: 10px;
  overflow: auto;
`;

// Inject error, helperText into control
const ControlHelper = ({control, errors, name, as, label, ...props}) =>
    <Controller
        {...props}
        name={name}
        control={control}
        label={label}
        error={Boolean(errors[name])}
        helperText={errors[name]?.message}
        size={'small'}
        fullWidth
        as={as}
    />;


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

                            editingBook,
                            onClose,
                        }) => {

    const {
        register,
        handleSubmit,
        control,
        getValues,
        reset,
        setValue,
        errors,
        trigger,
        watch
    } = useForm({
        resolver: yupResolver(YUP_SCHEMA),
        defaultValues: editingBook || DEFAULT_BOOK_VALUES,
        mode: 'onTouched',
    });

    const [searchOpen, setSearchOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [snackbar, setSnackbar] = useState(false)

    const onClear = name => () => setValue(name, DEFAULT_BOOK_VALUES[name]);
    const setError = useAsyncError()

    const onSubmit = data => {
        // Execute any transforms
        let transformedData = transformBeforeSubmit(data)

        alert(isValidatedUserInputSame(transformedData, editingBook))

       /* Url.submit(transformedData).then(() => {
            getBooks();
            reset();
        }).catch(setError);*/
    };

    const onError = () => void setSnackbar(true)

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


    return <DialogBlurResponsive open onClose={onClose}>
        <Snackbar
            open={snackbar}
            onClose={() => setSnackbar(false)}
            autoHideDuration={3000}>
            <Alert
                severity={'error'}
                onClose={() => setSnackbar(false)}>
                Check errors before submitting
            </Alert>
        </Snackbar>
        <FieldContainer>
            <SearchBooks
                open={searchOpen}
                close={() => setSearchOpen(false)}
                results={results}
                handleClick={handleClick}
            />
            <StyledButton
                color={'primary'}
                variant={'contained'}
                onClick={handleSubmit(onSubmit, onError)}
            >Submit
            </StyledButton>

            <ControlHelper
                name={BOOK_FIELDS.title}
                label={'Title'}
                control={control}
                as={StyledTextFieldClearable}
                errors={errors}

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
                    multiple={true}
                    name={name}
                    onBlur={onBlur}
                    onChange={onChange}
                    options={authors}
                    renderProps={{
                        label: 'Authors',
                        variant: 'outlined',

                        error: Boolean(errors[BOOK_FIELDS.authors]),
                        helperText: errors[BOOK_FIELDS.authors]?.message
                    }}
                    size={'small'}
                    value={value}
                />}
            />{JSON.stringify(watch('authors'))}

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
                    multiple={true}
                    name={name}
                    onBlur={onBlur}
                    onChange={onChange}
                    options={genres}
                    renderProps={{
                        label: 'Genres',
                        variant: 'outlined',

                        error: Boolean(errors[BOOK_FIELDS.genres]),
                        helperText: errors[BOOK_FIELDS.genres]?.message
                    }}
                    size={'small'}
                    value={value}
                />}
            />{JSON.stringify(watch('genres'))}

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
                        label: 'Types',
                        variant: 'outlined',

                        error: Boolean(errors[BOOK_FIELDS.type]),
                        helperText: errors[BOOK_FIELDS.type]?.message
                    }}
                    size={'small'}
                    value={value}
                />}
            />{JSON.stringify(watch('type'))}


            <ControlHelper
                name={BOOK_FIELDS.description}
                label={'Description'}
                errors={errors}
                as={StyledTextField}
                control={control}

                multiline
            />

            <FormControlLabel
                control={<Checkbox
                    name={BOOK_FIELDS.read_next}
                    inputRef={register}
                />}
                label={'Read next?'}
                labelPlacement={'end'}

            />
            <FormHelperText
                error={Boolean(errors[BOOK_FIELDS.read_next])}
            >
                {errors[BOOK_FIELDS.read_next]?.message}
            </FormHelperText>


            <MuiPickersUtilsProvider utils={DateFns}>
                <ControlHelper
                    name={BOOK_FIELDS.date_read}
                    label={'Date Read'}
                    control={control}
                    errors={errors}
                    as={KeyboardDatePicker}

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
                as={StyledTextFieldClearable}
                control={control}
                onClear={onClear(BOOK_FIELDS.image_url)}

                type={'url'} // More for browser input purposes than validation, as Yup handles that
            />

            <ControlHelper
                name={BOOK_FIELDS.published}
                label={'Year Published'}
                control={control}
                as={StyledTextFieldClearable}
                errors={errors}

                type={'tel'}
                onClear={onClear(BOOK_FIELDS.published)}
            />

            <ControlHelper
                name={BOOK_FIELDS.google_id}
                label={'Google ID'}
                control={control}
                as={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.google_id)}
            />

            <ControlHelper
                name={BOOK_FIELDS.goodreads_book_id}
                label={'Goodreads ID'}
                control={control}
                as={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.goodreads_book_id)}
            />

            <ControlHelper
                name={BOOK_FIELDS.series}
                label={'Series Name'}
                control={control}
                as={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.series)}
            />

            <ControlHelper
                name={BOOK_FIELDS.series_position}
                label={'Series Position'}
                control={control}
                as={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.series_position)}
            />

            <ControlHelper
                name={BOOK_FIELDS.rating}
                label={'Rating'}
                control={control}
                as={StyledTextFieldClearable}
                errors={errors}
                onClear={onClear(BOOK_FIELDS.rating)}
            />{String(watch('rating'))}

            <ControlHelper
                name={BOOK_FIELDS.my_review}
                label={'My Review'}
                control={control}
                as={StyledTextField}
                errors={errors}

                placeholder={'Not good, read others, highlight specific chapters, etc'}
                multiline
            />

            <ControlHelper
                name={BOOK_FIELDS.notes}
                label={'Notes'}
                control={control}
                as={StyledTextField}
                errors={errors}

                placeholder={'Specific edition, comments on metadata, somebody recommended me, want to buy etc'}
                multiline
            />

        </FieldContainer>
    </DialogBlurResponsive>
};
