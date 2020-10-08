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
    FormHelperText,
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

    const onClear = name => () => setValue(name, defaultBookValues[name]);

    const onSubmit = (data, e) => {

        // Modify data before submission
        data[bookFields.authors] = data[bookFields.authors].map(v => v.id);
        data[bookFields.genres] = data[bookFields.genres].map(v => v.id);
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

            /*
            * authors: Array [ "Doug Walsh", "BradyGames" ]
            * description: "Presents step-by-step walkthroughs for the game, along with information on strategies, characters, and tactics."
            * from: "google"
            * google_id: "N6zXSAAACAAJ"
            * image_url: "http://books.google.com/books/content?id=N6zXSAAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
            * published: 2010
            * title: "Halo Reach: Signature Series Guide"*/
            // series name, position also (from bookinfo)

            setValue(bookFields.authors, authorsToAdd);
            [
                bookFields.description,
                bookFields.googleId,
                bookFields.goodreadsBookId,
                bookFields.imageUrl,
                bookFields.published,
                bookFields.title
            ].forEach(e => setValue(e, mergedResult[e] || getValues(e)));

            Promise.all(authorsToCreate.map(name => Url.addAuthor({name: name})))
                .then(r => setValue(bookFields.authors, [...authorsToAdd, ...r]));

            setDebugValues(mergedResult);
            setLoadingSearch(false);
            trigger()
        });
    };

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

                <ControlHelper
                    name={bookFields.title}
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
                    onClear={onClear(bookFields.title)}
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
                    name={bookFields.genres}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <StyledAutocompleteMultiSort
                        getValues={() => getValues(bookFields.genres)}
                        name={name}
                        label={'Genres'}
                        renderProps={{
                            error: Boolean(errors[bookFields.genres]),
                            helperText: errors[bookFields.genres]?.message
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
                        value={value}
                        multiple={false}
                        setValue={val => onChange(val)}
                        options={types}
                        refreshOptions={getTypes}
                        callback={Url.addType}
                    />}
                />


                <ControlHelper
                    name={bookFields.description}
                    label={'Description'}
                    errors={errors}
                    as={StyledTextField}
                    control={control}

                    multiline
                />

                <FormControlLabel
                    control={<Checkbox
                        name={'readNext'}
                        inputRef={register}
                    />}
                    label={'Read next?'}
                    labelPlacement={'end'}

                />
                <FormHelperText
                    error={Boolean(errors[bookFields.readNext])}
                >
                    {errors[bookFields.readNext]?.message}
                </FormHelperText>


                <MuiPickersUtilsProvider utils={DateFns}>
                    <ControlHelper
                        name={bookFields.dateRead}
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
                    name={bookFields.imageUrl}
                    errors={errors}
                    label={'Image URL'}
                    as={StyledTextFieldClearable}
                    control={control}
                    onClear={onClear(bookFields.imageUrl)}

                    type={'url'} // More for browser input purposes than validation, as Yup handles that
                />

                <ControlHelper
                    name={bookFields.published}
                    label={'Year Published'}
                    control={control}
                    as={StyledTextFieldClearable}
                    errors={errors}

                    type={'tel'}
                    onClear={onClear(bookFields.published)}
                />

                <ControlHelper
                    name={bookFields.googleId}
                    label={'Google ID'}
                    control={control}
                    as={StyledTextFieldClearable}
                    errors={errors}
                    onClear={onClear(bookFields.googleId)}
                />

                <ControlHelper
                    name={bookFields.goodreadsBookId}
                    label={'Goodreads ID'}
                    control={control}
                    as={StyledTextFieldClearable}
                    errors={errors}
                    onClear={onClear(bookFields.goodreadsBookId)}
                />

                <ControlHelper
                    name={bookFields.series}
                    label={'Series Name'}
                    control={control}
                    as={StyledTextFieldClearable}
                    errors={errors}
                    onClear={onClear(bookFields.series)}
                />

                <ControlHelper
                    name={bookFields.seriesPosition}
                    label={'Series Position'}
                    control={control}
                    as={StyledTextFieldClearable}
                    errors={errors}
                    onClear={onClear(bookFields.seriesPosition)}
                />

                <ControlHelper
                    name={bookFields.rating}
                    label={'Rating'}
                    control={control}
                    as={StyledTextFieldClearable}
                    errors={errors}
                    onClear={onClear(bookFields.rating)}
                />

                <ControlHelper
                    name={bookFields.myReview}
                    label={'My Review'}
                    control={control}
                    as={StyledTextField}
                    errors={errors}

                    placeholder={'Not good, read others, highlight specific chapters, etc'}
                    multiline
                />

                <ControlHelper
                    name={bookFields.notes}
                    label={'Notes'}
                    control={control}
                    as={StyledTextField}
                    errors={errors}

                    placeholder={'Specific edition, comments on metadata, somebody recommended me, want to buy etc'}
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
