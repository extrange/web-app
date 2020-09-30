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
import {submit} from "./urls";
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

// .required() ensures that all objects *must* contain an 'id' field with an integer
// which is later extracted and mapped into the final array for submission
const arrayWithId = yup.array(yup.number().integer().required()).ensure().transform(val => val.map(v => v.id));

// This field will be null if omitted or a falsey value ('', undefined or null)
const blankStringToNull = yup.string().defined().transform(val => !val ? null : val).default(null);

// Schema, after coercion and validation, should be ready for submission
const bookSchema = yup.object({
    authors: arrayWithId,
    genre: arrayWithId,
    type: yup.number().integer().transform(val => val.id),
    title: yup.string().required(),
    description: yup.string().uppercase(),
    readNext: yup.bool(),
    dateRead: yup.date(),
    imageUrl: yup.string().url(),
    published: yup.number().integer(),
    googleId: blankStringToNull,
    goodreadsId: blankStringToNull,
    series: yup.string(),
    seriesPosition: yup.string(),
    rating: yup.number().transform(v => Math.round(v*10)/10).min(0).max(5),
    myReview: yup.string(),
    notes: yup.string(),

}).noUnknown();

bookSchema.validate({
    type: {id:3}
}).then(r => console.log(r));


export const AddBooks = (refreshBooks, ...props) => {

    const {register, handleSubmit, control, getValues, reset, setValue, errors} = useForm({
        mode: "onTouched",
        resolver: yupResolver(bookSchema),
        defaultValues: {
            authors: [],
            genre: [],
            type: null, //only one type allowed per book
            title: '',
            description: '',
            readNext: false,
            dateRead: null,
            imageUrl: '',
            published: '',
            googleId: '',
            goodreadsId: '',
            series: '',
            seriesPosition: '',
            rating: null,
            myReview: '',
            notes: '',
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
                    name={'title'}
                    label={'Title'}
                    size={'small'}
                    multiline
                    fullWidth
                    onClear={() => setValue('title', '')}
                />
                {errors.title?.message}

                <Controller
                    name={'authors'}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <StyledAutocompleteMultiSort
                        getValues={() => getValues('authors')}
                        name={name}
                        label={'Authors'}
                        size={'small'}
                        value={value}
                        setValue={val => onChange(val)}
                        onBlur={onBlur}
                        options={authors}
                        refreshOptions={getAuthors}
                        callback={Url.addAuthor}
                    />}
                />
                {errors.authors?.message}

                <Controller
                    name={'genre'}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <StyledAutocompleteMultiSort
                        name={name}
                        label={'Genres'}
                        required
                        size={'small'}
                        value={value}
                        setValue={val => onChange(val)}
                        onBlur={onBlur}
                        options={genres}
                        refreshOptions={getGenres}
                        callback={Url.addGenre}
                    />}
                />
                {errors.genre?.message}

                <Controller
                    name={'type'}
                    control={control}
                    render={({onChange, onBlur, value, name}) => <StyledAutocompleteMultiSort
                        name={name}
                        onBlur={onBlur}
                        label={'Type'}
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
                {errors.type?.message}

                <StyledTextField
                    inputRef={register()}
                    name={'description'}
                    label={'Description'}
                    required
                    size={'small'}
                    multiline
                    fullWidth
                />
                {errors.description?.message}

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
                    name={'dateRead'}
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
                            onChange={onChange} //todo do something with the invalid date
                            value={value}
                            inputVariant={'outlined'}
                            variant={'inline'}
                        />
                    </MuiPickersUtilsProvider>
                    }
                />
                {errors.dateRead?.message}


                <StyledTextFieldClearable
                    name={'imageUrl'}
                    inputRef={register}
                    label={'Image URL'}
                    required
                    size={'small'}
                    fullWidth
                    type={'url'}
                    onClear={e => setValue('imageUrl', '')}
                />
                {errors.imageUrl?.message}

                <StyledTextFieldClearable
                    name={'published'}
                    inputRef={register}
                    label={'Year published'}
                    size={'small'}
                    required
                    fullWidth
                    type={'tel'}
                    onClear={e => setValue('published', '')}
                />
                {errors.published?.message}

                <StyledTextFieldClearable
                    name={'googleId'}
                    inputRef={register}
                    label={'Google ID'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue('googleId', '')}
                />
                {errors.googleId?.message}

                <StyledTextFieldClearable
                    name={'goodreadsId'}
                    inputRef={register}
                    label={'Goodreads ID'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue('goodreadsId', '')}
                />
                {errors.goodreadsId?.message}

                <StyledTextFieldClearable
                    name={'series'}
                    inputRef={register}
                    label={'Series Name'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue('series', '')}
                />
                {errors.series?.message}

                <StyledTextFieldClearable
                    name={'seriesPosition'}
                    label={'Series Position'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue('seriesPosition', '')}
                />
                {errors.seriesPosition?.message}

                <StyledTextFieldClearable
                    name={'rating'}
                    inputRef={register}
                    label={'Rating'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue('rating', '')}
                />
                {errors.rating?.message}

                <StyledTextField
                    name={'myReview'}
                    inputRef={register}
                    label={'My Review'}
                    size={'small'}
                    helperText={'Not good, read others, highlight specific chapters, etc'}
                    fullWidth
                    multiline
                />
                {errors.myReview?.message}

                <StyledTextField
                    name={'notes'}
                    inputRef={register}
                    label={'Notes'}
                    size={'small'}
                    helperText={'Specific edition, comments on metadata, somebody recommended me, want to buy etc'}
                    fullWidth
                    multiline
                />
                {errors.notes?.message}

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
