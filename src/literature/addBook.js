import React, {useEffect, useState} from 'react';
import {
    StyledAutocompleteMultiSort,
    StyledButton,
    StyledTextField,
    StyledTextFieldClearable
} from "../components/common";
import * as Url from "./urls";
import {getGoodreadsBookInfo, getGoogleBookInfo} from "./urls";
import styled from "styled-components";
import SearchIcon from '@material-ui/icons/Search';
import {KeyboardDatePicker} from "@material-ui/pickers/DatePicker";
import {MuiPickersUtilsProvider} from "@material-ui/pickers/MuiPickersUtilsProvider"
import DateFns from '@date-io/date-fns'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers";
import {format, isValid} from "date-fns"
import {bookFields, bookSchema, defaultBookValues, resultType} from "./schema";
import {SearchBooks} from "./searchBooks";
import {Networking, sanitizeString} from "../util";
import {
    Checkbox,
    CircularProgress,
    FormControlLabel,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import {mergeWith} from "lodash";

const FieldContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 500px;
    margin: 10px;
    overflow: auto;
`;

const BigContainer = styled.div`
    display: flex;
    max-width: 1000px;
    flex-direction: row;
    justify-content: space-between;
`;

export const AddBooks = ({refreshBooks, ...props}) => {

    const {register, handleSubmit, control, getValues, reset, setValue, errors, trigger} = useForm({
        resolver: yupResolver(bookSchema),
        defaultValues: defaultBookValues,
    });

    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [types, setTypes] = useState([]);
    const [debugValues, setDebugValues] = useState({});
    const [searchOpen, setSearchOpen] = useState(false);

    const [results, setResults] = useState([]);

    const [loadingSearch, setLoadingSearch] = useState(false);

    const getAuthors = () => {
        Url.getAuthors().then(result => setAuthors(result))
    };
    const getGenres = () => {
        Url.getGenres().then(result => setGenres(result))
    };
    const getTypes = () => {
        Url.getTypes().then(result => setTypes(result))
    };

    // Load authors, genre, types
    useEffect(() => {
        getAuthors();
        getGenres();
        getTypes();
    }, []);

    const onSubmit = (data, e) => {
        // Modify data before submission
        data[bookFields.authors] = data[bookFields.authors].map(v => v.id);
        data[bookFields.genre] = data[bookFields.genre].map(v => v.id);
        data[bookFields.type] = data[bookFields.type] ? data[bookFields.type].id : null;
        data[bookFields.dateRead] = isValid(data[bookFields.dateRead]) ? format(data[bookFields.dateRead], 'yyyy-MM-dd') : null;

        setDebugValues(data);
        Url.submit(data).then(refreshBooks);
        reset()
    };

    const onError = data => setDebugValues(data); //todo make snackbar with dialog to view JSON response of error

    const onSearch = event => {
        if (event.key !== 'Enter' || !getValues(bookFields.title)) return;
        setLoadingSearch(true);
        Networking.send(`${Url.SEARCH}?q=${getValues(bookFields.title)}`, {method: 'GET',})
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
        let type = result.from === resultType.GOOGLE ? resultType.GOOGLE : resultType.GOODREADS;
        let request;
        if (type === resultType.GOOGLE) {
            // Use ISBN_13 if available, otherwise ISBN_10
            request = getGoogleBookInfo(result.ISBN_13 || result.ISBN_10)
        } else {
            request = getGoodreadsBookInfo(result.goodreads_work_id, result.goodreads_book_id)
        }
        setSearchOpen(false);
        request.then(r => {
            console.log('result', result);
            console.log('info', r);
            let mergedResult = mergeWith({}, result, r,
                //preferentially choose srcVal over existing values if both present
                (objVal, srcVal) => srcVal || objVal);

            /*For the 'authors' autocomplete field: TODO
            * - check if exists (case insensitive)
            * - add existing authors, then async create and add new authors
            * - update form in the meantime
            * */

            let authorsToAdd = []; // [] of {id, name, notes}

            let authorsToCreate = []; // [] of String

            mergedResult.authors.forEach(e => {
                //todo EXTREMELY INEFFICIENT
                let val = authors.find(author => sanitizeString(author.name) === sanitizeString(e));
                console.log('val', val);
                if (val) {
                    // Author already exists
                    authorsToAdd.push(val)
                } else {
                    // Author doesn't exist, to create
                    authorsToCreate.push(e)
                }
            });

            console.log('Authors to add: ', authorsToAdd);
            console.log('Authors to create: ', authorsToCreate);

            // Add all current values first

            /*
            * authors: Array [ "Doug Walsh", "BradyGames" ]
            * description: "Presents step-by-step walkthroughs for the game, along with information on strategies, characters, and tactics."
            * from: "google"
            * google_id: "N6zXSAAACAAJ"
            * image_url: "http://books.google.com/books/content?id=N6zXSAAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
            * published: 2010
            * title: "Halo Reach: Signature Series Guide"*/
            // series name, position also (from bookinfo)
//todo fix label shrink state..
            setValue(bookFields.authors, authorsToAdd);
            [
                bookFields.description,
                bookFields.googleId,
                bookFields.goodreadsId, //todo use book_id or work_id??
                bookFields.imageUrl,
                bookFields.published,
                bookFields.title
            ].forEach(e => setValue(e, mergedResult[e] || getValues(e)), {shouldDirty: true});

            Promise.all(authorsToCreate.map(name => Url.addAuthor({name: name})))
                .then(r => setValue(bookFields.authors, [...authorsToAdd, ...r]));

            setDebugValues(mergedResult);
            setLoadingSearch(false);
            trigger()
        });
    };

    // Todo Move all these fields to a parameterizable class instead
    return <>
        <SearchBooks
            open={searchOpen}
            close={() => setSearchOpen(false)}
            results={results}
            handleClick={handleClick}
        />
        <BigContainer>
            <FieldContainer>
                <StyledButton
                    color={'primary'}
                    variant={'contained'}
                    onClick={handleSubmit(onSubmit, onError)}
                >Submit
                </StyledButton>

                <StyledTextFieldClearable
                    inputRef={register}
                    name={bookFields.title}
                    label={'Title'}
                    placeholder={'Search for a book'}
                    onKeyPress={onSearch}
                    size={'small'}
                    error={Boolean(errors[bookFields.title])}
                    helperText={errors[bookFields.title]?.message}
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
                    fullWidth
                    onClear={() => setValue(bookFields.title, '')}
                />

                <Controller
                    name={bookFields.authors}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <StyledAutocompleteMultiSort
                        getValues={() => getValues(bookFields.authors)}
                        name={name}
                        label={'Authors'}
                        renderProps={{
                            error: Boolean(errors[bookFields.authors]),
                            helperText: errors[bookFields.authors]?.message
                        }}
                        size={'small'}
                        value={value}
                        setValue={val => onChange(val)}
                        onBlur={onBlur}
                        options={authors}
                        refreshOptions={getAuthors}
                        callback={Url.addAuthor}
                    />}
                />

                <Controller
                    name={bookFields.genre}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <StyledAutocompleteMultiSort
                        getValues={() => getValues(bookFields.genre)}
                        name={name}
                        label={'Genres'}
                        required
                        renderProps={{
                            error: Boolean(errors[bookFields.genre]),
                            helperText: errors[bookFields.genre]?.message
                        }}
                        size={'small'}
                        value={value}
                        setValue={val => onChange(val)}
                        onBlur={onBlur}
                        options={genres}
                        refreshOptions={getGenres}
                        callback={Url.addGenre}
                    />}
                />

                <Controller
                    name={bookFields.type}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <StyledAutocompleteMultiSort
                        name={name}
                        onBlur={onBlur}
                        label={'Type'}
                        renderProps={{
                            error: Boolean(errors[bookFields.type]),
                            helperText: errors[bookFields.type]?.message
                        }}
                        size={'small'}
                        required
                        value={value}
                        multiple={false}
                        setValue={val => onChange(val)}
                        options={types}
                        refreshOptions={getTypes}
                        callback={Url.addType}
                    />}
                />

                <StyledTextField
                    inputRef={register()}
                    name={'description'}
                    label={'Description'}
                    error={Boolean(errors[bookFields.description])}
                    helperText={errors[bookFields.description]?.message}
                    required
                    size={'small'}
                    multiline
                    fullWidth
                />

                <FormControlLabel
                    control={<Checkbox
                        name={'readNext'}
                        inputRef={register}
                    />}
                    label={'Read next?'}
                    labelPlacement={'start'}
                />
                {errors.readNext?.message}

                <Controller
                    name={bookFields.dateRead}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <MuiPickersUtilsProvider
                        utils={DateFns}>
                        <KeyboardDatePicker
                            name={name}
                            autoOk
                            disableFuture
                            size={'small'}
                            label={'Date Read'}
                            format={'dd/MM/yyyy'}
                            onBlur={onBlur}
                            placeholder={'dd/mm/yyyy'}
                            error={Boolean(errors[bookFields.dateRead])}
                            helperText={errors[bookFields.dateRead]?.message}
                            onChange={onChange}
                            value={value}
                            inputVariant={'outlined'}
                            variant={'inline'}
                        />
                    </MuiPickersUtilsProvider>
                    }
                />

                <StyledTextFieldClearable
                    name={bookFields.imageUrl}
                    error={Boolean(errors[bookFields.imageUrl])}
                    helperText={errors[bookFields.imageUrl]?.message}
                    inputRef={register}
                    label={'Image URL'}
                    required
                    size={'small'}
                    fullWidth
                    type={'url'}
                    onClear={e => setValue(bookFields.imageUrl, '')}
                />

                <StyledTextFieldClearable
                    name={bookFields.published}
                    inputRef={register}
                    label={'Year published'}
                    error={Boolean(errors[bookFields.published])}
                    helperText={errors[bookFields.published]?.message}
                    size={'small'}
                    fullWidth
                    type={'tel'}
                    onClear={e => setValue(bookFields.published, '')}
                />

                <StyledTextFieldClearable
                    name={bookFields.googleId}
                    inputRef={register}
                    error={Boolean(errors[bookFields.googleId])}
                    helperText={errors[bookFields.googleId]?.message}
                    label={'Google ID'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue(bookFields.googleId, '')}
                />

                <StyledTextFieldClearable
                    name={bookFields.goodreadsId}
                    inputRef={register}
                    error={Boolean(errors[bookFields.goodreadsId])}
                    helperText={errors[bookFields.goodreadsId]?.message}
                    label={'Goodreads ID'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue(bookFields.goodreadsId, '')}
                />

                <StyledTextFieldClearable
                    name={bookFields.series}
                    inputRef={register}
                    error={Boolean(errors[bookFields.series])}
                    helperText={errors[bookFields.series]?.message}
                    label={'Series Name'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue(bookFields.series, '')}
                />

                <StyledTextFieldClearable
                    name={bookFields.seriesPosition}
                    inputRef={register}
                    error={Boolean(errors[bookFields.seriesPosition])}
                    helperText={errors[bookFields.seriesPosition]?.message}
                    label={'Series Position'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue(bookFields.seriesPosition, '')}
                />

                <StyledTextFieldClearable
                    name={bookFields.rating}
                    error={Boolean(errors[bookFields.rating])}
                    helperText={errors[bookFields.rating]?.message}
                    inputRef={register}
                    label={'Rating'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue(bookFields.rating, '')}
                />

                <StyledTextField
                    name={bookFields.myReview}
                    inputRef={register}
                    error={Boolean(errors[bookFields.myReview])}
                    helperText={errors[bookFields.myReview]?.message}
                    label={'My Review'}
                    size={'small'}
                    placeholder={'Not good, read others, highlight specific chapters, etc'}
                    fullWidth
                    multiline
                />

                <StyledTextField
                    name={bookFields.notes}
                    inputRef={register}
                    error={Boolean(errors[bookFields.notes])}
                    helperText={errors[bookFields.notes]?.message}
                    label={'Notes'}
                    size={'small'}
                    placeholder={'Specific edition, comments on metadata, somebody recommended me, want to buy etc'}
                    fullWidth
                    multiline
                />

            </FieldContainer>

            {/*todo DEBUG*/}
            <FieldContainer>
                <StyledButton
                    color={'primary'}
                    variant={'contained'}
                    onClick={() => setDebugValues(getValues())}
                >Get Values
                </StyledButton>

                <Table style={{maxWidth: '500px', flex: '1'}} size={'small'}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Key</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(debugValues).map(([k, v]) =>
                            <TableRow key={String(k)}>
                                <TableCell>{String(k)}</TableCell>
                                <TableCell>
                                    <Typography>{JSON.stringify(v, null, 4)}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </FieldContainer>

        </BigContainer>

    </>;
};
