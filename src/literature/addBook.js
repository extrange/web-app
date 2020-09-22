import React, {useEffect, useState} from 'react';
import {Networking, urlRegex, useInput} from "../util";
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


export const AddBooks = props => {
    const {values, setValue: setValue_, onChange, bind} = useInput({
        authors: [],
        genres: [],
        types: null, //only one type allowed per book
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
    });

    const {register, handleSubmit, control, getValues, reset, setValue, errors} = useForm({
        mode: "onTouched",
        defaultValues: {
            authors: [],
            genres: [],
            types: null, //only one type allowed per book
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

    // Load authors, genre, types
    useEffect(() => {
        getAuthors();
        getGenres();
        getTypes();
    }, []);

    const submit = () => {
    };

    const search = event => {
        if (event.key !== 'Enter' || !values.search) return;
        setLoadingSearch(true);
        Networking.send(`${Url.SEARCH}?q=${values.search}`, {method: 'GET',})
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
                    onClick={handleSubmit(values => console.log(values))}
                    variant={'contained'}
                    color={'primary'}
                >Submit
                </StyledButton>

                <Controller
                    name={'title'}
                    control={control}
                    rules={{required: true, minLength: 5}}
                    as={<StyledTextFieldClearable
                        label={'Title'}
                        size={'small'}
                        error={errors.title}
                        multiline
                        fullWidth
                        onClear={() => setValue('title', '')}
                    />}
                />
                {errors.title && 'hi'}

                <Controller
                    name={'authors'}
                    control={control}
                    rules={{required: true, minLength: 2}}
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
                    />
                    }
                />
                {errors.authors && 'hi'}

                <StyledAutocompleteMultiSort
                    label={'Genres'}
                    required
                    size={'small'}
                    value={values['genres']}
                    setValue={val => setValue_({name: 'genres', value: val})}
                    options={genres}
                    refreshOptions={getGenres}
                    callback={Url.addGenre}
                />
                <StyledAutocompleteMultiSort
                    label={'Types'}
                    size={'small'}
                    required
                    value={values['types']}
                    multiple={false}
                    setValue={val => setValue_({name: 'types', value: val})}
                    options={types}
                    refreshOptions={getTypes}
                    callback={Url.addType}
                />
                <StyledTextField
                    label={'Description'}
                    required
                    size={'small'}
                    multiline
                    fullWidth
                    {...bind('description')}
                />
                <FormControlLabel
                    control={<Checkbox
                        checked={values['readNext']}
                        name={'readNext'}
                        onChange={e => setValue_({name: 'readNext', value: e.target.checked})}
                    />}
                    label={'Read next?'}
                    labelPlacement={'start'}
                />

                <MuiPickersUtilsProvider utils={DateFns}>
                    <KeyboardDatePicker
                        autoOk
                        disableFuture
                        size={'small'}
                        label={'Date Read'}
                        format={'dd/MM/yyyy'}
                        placeholder={'dd/mm/yyyy'}
                        onChange={(date, invalidValue) => setValue_({name: 'dateRead', value: date})}
                        value={values['dateRead']}
                        inputVariant={'outlined'}
                        variant={'inline'}
                    />
                </MuiPickersUtilsProvider>
                <StyledTextFieldClearable
                    label={'Image URL'}

                    required
                    size={'small'}
                    fullWidth
                    type={'url'}
                    error={values['imageUrl'] === '' ? false : !urlRegex.exec(values['imageUrl'])}
                    onClear={e => setValue_({name: 'imageUrl', value: ''})}
                    {...bind('imageUrl')}
                />
                <StyledTextFieldClearable
                    label={'Year published'}
                    size={'small'}
                    required
                    fullWidth
                    type={'tel'}
                    error={values['published'] === '' ? false : !/^\s*\d+\s*$/.exec(values['published'])}
                    onClear={e => setValue_({name: 'published', value: ''})}
                    {...bind('published')}
                />
                <StyledTextFieldClearable
                    label={'Google ID'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue_({name: 'googleId', value: ''})}
                    {...bind('googleId')}
                />
                <StyledTextFieldClearable
                    label={'Goodreads ID'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue_({name: 'goodreadsId', value: ''})}
                    {...bind('goodreadsId')}
                />
                <StyledTextFieldClearable
                    label={'Series Name'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue_({name: 'series', value: ''})}
                    {...bind('series')}
                />
                <StyledTextFieldClearable
                    label={'Series Position'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue_({name: 'seriesPosition', value: ''})}
                    {...bind('seriesPosition')}
                />
                <StyledTextFieldClearable
                    label={'Rating'}
                    size={'small'}
                    fullWidth
                    onClear={e => setValue_({name: 'rating', value: ''})}
                    {...bind('rating')}
                />
                <StyledTextField
                    label={'My Review'}
                    size={'small'}
                    helperText={'Not good, read others, highlight specific chapters, etc'}
                    fullWidth
                    multiline
                    {...bind('myReview')}
                />
                <StyledTextField
                    label={'Notes'}
                    size={'small'}
                    helperText={'Specific edition, comments on metadata, somebody recommended me, want to buy etc'}
                    fullWidth
                    multiline
                    {...bind('notes')}
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
                                <TableCell>{String(v)}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </FieldContainer>

        </BigContainer>

        <FieldContainer>
            <StyledTextFieldClearable //todo pullup into a separate component
                placeholder={'Search books'}
                {...bind('search')}
                onClear={() => setValue_({name: 'search', value: ''})}
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
