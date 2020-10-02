import React, {useEffect, useState} from 'react';
import {Networking} from "../util";
import {
    StyledAutocompleteMultiSort,
    StyledButton,
    StyledTextField,
    StyledTextFieldClearable
} from "../components/common";
import * as Url from "./urls";
import {GoodreadsBookResult, GoogleBookResult} from "./BookResult";
import styled from "styled-components";
import {InputAdornment} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {KeyboardDatePicker} from "@material-ui/pickers/DatePicker";
import {MuiPickersUtilsProvider} from "@material-ui/pickers/MuiPickersUtilsProvider"
import DateFns from '@date-io/date-fns'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Controller, useForm} from 'react-hook-form'
import {bookFields, bookFieldsMap, submit} from "./urls";
import {yupResolver} from "@hookform/resolvers";
import * as yup from "yup"

const CardContainer = styled.div`
    display: flex;
    max-width: 1000px;
    flex-flow: row wrap;
`;

const BookInfoContainer = styled.div`

`;

const FieldContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    max-width: 500px;
    margin: 10px;
`;

const BigContainer = styled.div`
    display: flex;
    max-width: 1000px;
    flex-direction: row;
    justify-content: space-between;
`;

// .required() ensures that objects (if any) in the array *must* contain an 'id' field with an integer
// which is later extracted and mapped into the final array for submission
const arrayWithId = yup.array(yup.number().integer().required()).ensure().transform(val => val.map(v => v.id));

// This field will be null if omitted or a falsey value ('', undefined or null)
const blankStringToNull = yup.string().defined().transform(val => val ? val : null).default(null);

// Schema, after coercion and validation, should be ready for submission
const bookSchema = yup.object({
    [bookFields.authors]: arrayWithId,
    [bookFields.genre]: arrayWithId,
    [bookFields.type]: yup.number().transform((val, origVal) => origVal?.id).required(),
    [bookFields.title]: yup.string().required(),
    [bookFields.description]: yup.string().uppercase(),
    [bookFields.readNext]: yup.bool(),
    [bookFields.dateRead]: yup.date().nullable(),
    [bookFields.imageUrl]: yup.string().url(), //todo validate as url without http instead
    [bookFields.published]: yup.number().integer(),
    [bookFields.googleId]: blankStringToNull,
    [bookFields.goodreadsId]: blankStringToNull,
    [bookFields.series]: yup.string(),
    [bookFields.seriesPosition]: yup.string(),
    [bookFields.rating]: yup.number().transform(v => Math.round(v * 10) / 10).min(0).max(5),
    [bookFields.myReview]: yup.string(),
    [bookFields.notes]: yup.string(),
}).noUnknown();


export const AddBooks = (refreshBooks, ...props) => {

    const {register, handleSubmit, control, getValues, reset, setValue, errors} = useForm({
        mode: "onTouched",
        resolver: yupResolver(bookSchema),
        defaultValues: {
            [bookFields.authors]: [],
            [bookFields.genre]: [],
            [bookFields.type]: null, //only one type allowed per book
            [bookFields.title]: '',
            [bookFields.description]: '',
            [bookFields.readNext]: false,
            [bookFields.dateRead]: null,
            [bookFields.imageUrl]: '',
            [bookFields.published]: '',
            [bookFields.googleId]: '',
            [bookFields.goodreadsId]: '',
            [bookFields.series]: '',
            [bookFields.seriesPosition]: '',
            [bookFields.rating]: null,
            [bookFields.myReview]: '',
            [bookFields.notes]: '',
        }
    });

    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [types, setTypes] = useState([]);

    const [results, setResults] = useState({'google': [], 'goodreads': []});
    const [bookInfo, setBookInfo] = useState({});

    const [loadingSearch, setLoadingSearch] = useState(false);

    const [debugValues, setDebugValues] = useState({});


    const getAuthors = () => {
        Url.getAuthors().then(result => setAuthors(result))
    };
    const getGenres = () => {
        Url.getGenres().then(result => setGenres(result))
    };
    const getTypes = () => {
        Url.getTypes().then(result => setTypes(result))
    };

    const onSubmit = (data, e) => console.log('submitted data:', data);
    const onError = data => console.log('errors:', data);

    // Load authors, genre, types
    useEffect(() => {
        getAuthors();
        getGenres();
        getTypes();
    }, []);

    const search = event => {
        if (event.key !== 'Enter' || !getValues('search')) return;
        setLoadingSearch(true);
        Networking.send(`${Url.SEARCH}?q=${getValues('search')}`, {method: 'GET',})
            .then(resp => resp.json())
            .then(json => {
                setResults(json['results']);
                setLoadingSearch(false);
            });
    };

    const getGoogleBookInfo = isbn => {
        Networking.send(`${Url.BOOK_INFO}?isbn=${isbn}`, {method: 'GET'})
            .then(resp => resp.json())
            .then(json => setBookInfo(json))
    };

    const getGoodreadsBookInfo = (work_id, book_id) => {
        Networking.send(`${Url.BOOK_INFO}?work_id=${work_id}&book_id=${book_id}`, {method: 'GET'})
            .then(resp => resp.json())
            .then(json => setBookInfo(json))
    };

    return <>
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
                    size={'small'}
                    error={errors[bookFields.title]}
                    helperText={errors[bookFields.title]?.message}
                    multiline
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
                            error={errors[bookFields.dateRead]}
                            helperText={errors[bookFields.dateRead]?.message}
                            onBlur={onBlur}
                            placeholder={'dd/mm/yyyy'}
                            onChange={(date, invalidStr) => invalidStr ? onChange(invalidStr) : onChange(date)}
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
                {errors.myReview?.message}

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
                                <TableCell>{JSON.stringify(v)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </FieldContainer>

        </BigContainer>

        <FieldContainer>
            <StyledTextFieldClearable //todo pullup into a separate component
                placeholder={'Search books'}
                name={'search'}
                inputRef={register}
                onClear={() => setValue('search', '')}
                onKeyPress={search}
                fullWidth
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
            />
        </FieldContainer>


        <CardContainer>
            {results['google'].map((result, index) => {
                return <GoogleBookResult {...result} onClick={e => getGoogleBookInfo(result['ISBN_13'])}/>
            })}
            {results['goodreads'].map((result, index) => {
                return <GoodreadsBookResult {...result}
                                            onClick={e => getGoodreadsBookInfo(result['goodreads_work_id'], result['goodreads_book_id'])}/>
            })}
        </CardContainer>
        <BookInfoContainer>
            {Object.entries(bookInfo).map(kv => {
                return <>{kv[0]}: {kv[1]}<br/></>
            })}
        </BookInfoContainer>

    </>;
};
