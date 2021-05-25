//Books in a series should be collapsible
import {useMemo, useState} from 'react';
import {Checkbox, Fab, FormControlLabel, Snackbar, TableContainer, TextField} from "@material-ui/core";
import styled from 'styled-components'
import {BACKGROUND_COLOR} from "../../shared/backgroundScreen";
import AddIcon from "@material-ui/icons/Add";
import {AddBook} from "./AddBook";
import {isBefore, parseISO, subMonths, subWeeks, subYears} from 'date-fns'
import {Alert, Autocomplete} from "@material-ui/lab";
import * as Url from './urls'
import {getGoodreadsBookInfo, getGoogleBookInfo} from './urls'
import {formatDistanceToNowPretty, sanitizeString} from "../../util/util";
import {matchSorter} from "match-sorter";
import {BOOK_FIELDS, DEFAULT_BOOK_VALUES} from "./schema";
import {Waypoint} from 'react-waypoint';
import {ThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme} from '@material-ui/core/styles'; //todo replace with v5 when out
import MUIDataTable, {debounceSearchRender} from "mui-datatables";
import {SearchBooks} from "./searchBooks";
import {mergeWith} from "lodash";
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';


const StyledTableContainer = styled(TableContainer)`
  ${BACKGROUND_COLOR};
`;

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

const BOOK_COLUMN_STATE = 'BOOK_COLUMN_STATE';

const DEFAULT_COLUMN_STATES = {
    [BOOK_FIELDS.image_url]: true,
    [BOOK_FIELDS.title]: true,
    [BOOK_FIELDS.authors]: true,
    [BOOK_FIELDS.genres]: true,
};

export const Books = ({
                          getBooks,
                          books,
                          setBooks,
                          authors,
                          setAuthors,
                          genres,
                          setGenres,
                          types,
                          setTypes,
                          getAuthors,
                          getGenres,
                          getTypes
                      }) => {
    const [searchBookOpen, setSearchBookOpen] = useState(false);
    const [bookData, setBookData] = useState(null);
    const [addedSnackbar, setAddedSnackbar] = useState(null);
    const [filteredItemsLength, setFilteredItemsLength] = useState(books.length);
    const [count, setCount] = useState(10);

    const getColumnState = column => localStorage.getItem(BOOK_COLUMN_STATE) ?
        JSON.parse(localStorage.getItem(BOOK_COLUMN_STATE))[column] :
        DEFAULT_COLUMN_STATES[column];

    const setColumnState = (column, state) => {
        let columnState = localStorage.getItem(BOOK_COLUMN_STATE)

        let parsedColumnState = columnState ? JSON.parse(columnState) : DEFAULT_COLUMN_STATES;
        localStorage.setItem(BOOK_COLUMN_STATE, JSON.stringify({
            ...parsedColumnState,
            [column]: state
        }));
    };

    const dateOptions = useMemo(() => [
        {
            name: 'All',
            date: new Date(0),
        },
        {
            name: 'Last week',
            date: subWeeks(new Date(), 1)
        },
        {
            name: 'Last month',
            date: subMonths(new Date(), 1)
        },
        {
            name: 'Last year',
            date: subYears(new Date(), 1)
        }
    ], [])

    /*Get book description from results
    * todo Note: Goodreads is getting deprecated...*/
    const handleSearch = result => {
        let type = result.from;
        let request;
        if (type === 'google') {
            // Use ISBN_13 if available, otherwise ISBN_10
            request = getGoogleBookInfo(result.ISBN_13 || result.ISBN_10)
        } else {
            request = getGoodreadsBookInfo(result.goodreads_work_id, result.goodreads_book_id)
        }
        return request.then(r => {
            let mergedResult = mergeWith({}, result, r,
                //preferentially choose srcVal over existing values if both present
                (objVal, srcVal) => srcVal || objVal);

            let authorsToAdd = []; // [] of {id, name, notes}
            let authorsToCreate = []; // [] of String

            mergedResult.authors.forEach(e => {
                let val = authors.find(author => sanitizeString(author.name) === sanitizeString(e));
                if (val) {
                    // Author already exists
                    authorsToAdd.push(val)
                } else {
                    // Author doesn't exist, to create
                    authorsToCreate.push(e)
                }
            });

            let bookResult = Object.assign({}, DEFAULT_BOOK_VALUES);

            [
                BOOK_FIELDS.description,
                BOOK_FIELDS.google_id,
                BOOK_FIELDS.goodreads_book_id,
                BOOK_FIELDS.image_url,
                BOOK_FIELDS.published,
                BOOK_FIELDS.title,
                BOOK_FIELDS.series,
                BOOK_FIELDS.series_position
            ].forEach(e => mergedResult[e] && (bookResult[e] = mergedResult[e]));

            return Promise
                .all(authorsToCreate.map(name => Url.addAuthor({name: name})))
                .then(r => {
                    bookResult[BOOK_FIELDS.authors] = [...authorsToAdd, ...r].map(e => e.id);
                    return getAuthors().then(() => bookResult);
                });

        });
    };

    const columns = useMemo(() => [
        {
            label: 'Cover',
            name: BOOK_FIELDS.image_url,
            options: {
                filter: false,
                searchable: false,
                sort: false,
                customBodyRenderLite: dataIndex => books[dataIndex][BOOK_FIELDS.image_url] ?
                    <img alt={''} src={books[dataIndex][BOOK_FIELDS.image_url]} style={{maxHeight: '80px'}}/> : null,
            },
        },
        {
            label: 'Title',
            name: BOOK_FIELDS.title,
            options: {
                filter: false,
            }
        },
        {
            label: 'Authors',
            name: BOOK_FIELDS.authors,
            options: {
                customBodyRenderLite: dataIndex =>
                    books[dataIndex][BOOK_FIELDS.authors]
                        .map(id => authors.find(authors => authors.id === id)?.name)
                        .join(', '),
                customFilterListOptions: {
                    render: val => val.map(e => `Author: ${e.name}`)
                },
                filterType: 'custom',
                filterOptions: {
                    logic: (el, filters) => filters.length && !filters.some(e => el.includes(e.id)),
                    display: (filterList, onChange, index, column) =>
                        <Autocomplete
                            autoComplete
                            autoHighlight
                            filterSelectedOptions
                            filterOptions={(options, state) =>
                                matchSorter(options,
                                    state.inputValue,
                                    {keys: ['name']}
                                ).slice(0, 10)}
                            getOptionLabel={option => option.name}
                            multiple
                            onChange={(event, value) => {
                                onChange(value, index, column)
                            }}
                            options={authors}
                            renderInput={params => <TextField {...params} label={'Author'}/>}
                            value={filterList[index]}
                        />
                },
            }
        },
        {
            label: 'Genres',
            name: BOOK_FIELDS.genres,
            options: {
                customBodyRenderLite: dataIndex => books[dataIndex][BOOK_FIELDS.genres]
                    .map(id => genres.find(genres => genres.id === id)?.name).join(', '),
                customFilterListOptions: {
                    render: val => val.map(e => `Genre: ${e.name}`)
                },
                filterType: 'custom',
                filterOptions: {
                    logic: (el, filters) => filters.length && !filters.some(e => el.includes(e.id)),
                    display: (filterList, onChange, index, column) =>
                        <Autocomplete
                            autoComplete
                            autoHighlight
                            filterSelectedOptions
                            filterOptions={(options, state) =>
                                matchSorter(options,
                                    state.inputValue,
                                    {keys: ['name']}
                                )}
                            getOptionLabel={option => option.name}
                            multiple
                            onChange={(event, value) => {
                                onChange(value, index, column)
                            }}
                            options={genres}
                            renderInput={params => <TextField {...params} label={'Genre'}/>}
                            value={filterList[index]}
                        />
                },
            }
        },
        {
            label: 'Type',
            name: BOOK_FIELDS.type,
            options: {
                customBodyRenderLite: dataIndex => types.find(type => type.id === books[dataIndex][BOOK_FIELDS.type])?.name,
                customFilterListOptions: {
                    render: v => `Type: ${types.find(type => type.id === v).name}`
                },
                filterOptions: {
                    renderValue: v => types.find(type => type.id === v).name,
                },
                filterType: 'multiselect',
            }
        },
        {
            label: 'Description',
            name: BOOK_FIELDS.description,
            options: {
                filter: false,
            }
        },
        {
            label: 'Date added',
            name: 'date_added', // date_added is not in BOOK_FIELDS
            options: {
                customBodyRenderLite: dataIndex => formatDistanceToNowPretty(parseISO(books[dataIndex].date_added)), // date_added is not in BOOK_FIELDS
                customFilterListOptions: {
                    render: v => `Date Added: ${v[0].name}`
                },
                filterOptions: {
                    logic: (el, filters) => filters.length && isBefore(parseISO(el), filters[0].date),
                    display: (filterList, onChange, index, column) =>
                        <Autocomplete
                            autoComplete
                            autoHighlight
                            getOptionLabel={e => e.name}
                            getOptionSelected={(opt, val) => opt.name === val.name}
                            onChange={(event, value) =>
                                onChange(value ? [value] : [], index, column)}
                            options={dateOptions}
                            renderInput={params => <TextField {...params} label={'Date Added'}/>}
                            value={filterList[index].length ? filterList[index][0] : dateOptions[0]}
                        />
                },
                filterType: 'custom',
                searchable: false,
                sortDescFirst: true,
            },
        },
        {
            label: 'Read Next',
            name: BOOK_FIELDS.read_next,
            options: {
                customBodyRenderLite: dataIndex => books[dataIndex][BOOK_FIELDS.read_next] ?
                    <ErrorOutlineOutlinedIcon color={'secondary'}/> : '',
                customFilterListOptions: {
                    render: () => 'Read Next'
                },
                filterOptions: {
                    logic: (el, filters) => filters.length && !el,
                    display: (filterList, onChange, index, column) =>
                        <FormControlLabel
                            control={<Checkbox
                                checked={Boolean(filterList[index][0])}
                                onChange={e => onChange(e.target.checked ? [true] : [], index, column)}
                            />}
                            label={'Read Next'}/>
                },
                filterType: 'custom',
                searchable: false,
            }
        },
        {
            label: 'Date Read',
            name: BOOK_FIELDS.date_read,
            options: {
                customBodyRenderLite: dataIndex => books[dataIndex][BOOK_FIELDS.date_read] ?
                    formatDistanceToNowPretty(parseISO(books[dataIndex][BOOK_FIELDS.date_read])) : '',
                customFilterListOptions: {
                    render: v => `Date Read: ${v[0].name}`
                },
                filterOptions: {
                    logic: (el, filters) => filters.length && (isBefore(parseISO(el), filters[0].date) || !Boolean(el)),
                    display: (filterList, onChange, index, column) =>
                        <Autocomplete
                            autoComplete
                            autoHighlight
                            getOptionLabel={e => e.name}
                            getOptionSelected={(opt, val) => opt.name === val.name}
                            onChange={(event, value) =>
                                onChange(value ? [value] : [], index, column)}
                            options={dateOptions}
                            renderInput={params => <TextField {...params} label={'Date Read'}/>}
                            value={filterList[index].length ? filterList[index][0] : dateOptions[0]}
                        />
                },
                filterType: 'custom',
                searchable: false,
                sortDescFirst: true,
            },
        },

        {
            label: 'Published',
            name: BOOK_FIELDS.published,
            options: {
                filter: false,
                sortDescFirst: true
            },
        },
        {
            label: 'Series',
            name: BOOK_FIELDS.series,
            options: {
                customBodyRenderLite: dataIndex => {
                    let row = books[dataIndex];
                    return row[BOOK_FIELDS.series] ? `${row[BOOK_FIELDS.series]} #${row[BOOK_FIELDS.series_position]}` : ''
                },
                customFilterListOptions: {
                    render: v => v.map(e => `Series: ${e}`)
                },
                filterType: 'custom',
                filterOptions: {
                    logic: (el, filters) => filters.length && !filters.some(e => e === el),
                    display: (filterList, onChange, index, column) =>
                        <Autocomplete
                            autoComplete
                            autoHighlight
                            filterSelectedOptions
                            filterOptions={(options, state) =>
                                matchSorter(options, state.inputValue,)}
                            multiple
                            onChange={(event, value) => {
                                onChange(value, index, column)
                            }}
                            options={[...new Set(books.map(e => e[BOOK_FIELDS.series]).filter(e => Boolean(e)))]}
                            renderInput={params => <TextField {...params} label={'Series'}/>}
                            value={filterList[index]}
                        />
                },
            }
        },
        {
            label: 'Rating',
            name: BOOK_FIELDS.rating,
            options: {
                searchable: false,
            }
        },
        {
            label: 'My Review',
            name: BOOK_FIELDS.my_review,
            options: {
                filter: false,
            }
        },
        {
            label: 'Notes',
            name: BOOK_FIELDS.notes,
            options: {
                filter: false,
            }
        },
        {
            label: 'Updated',
            name: 'updated',
            options: {
                customBodyRenderLite: dataIndex => formatDistanceToNowPretty(parseISO(books[dataIndex].updated)),
                customFilterListOptions: {
                    render: v => `Updated: ${v[0].name}`
                },
                filterOptions: {
                    logic: (el, filters) => filters.length && isBefore(parseISO(el), filters[0].date),
                    display: (filterList, onChange, index, column) =>
                        <Autocomplete
                            autoComplete
                            autoHighlight
                            getOptionLabel={e => e.name}
                            getOptionSelected={(opt, val) => opt.name === val.name}
                            onChange={(event, value) =>
                                onChange(value ? [value] : [], index, column)}
                            options={dateOptions}
                            renderInput={params => <TextField {...params} label={'Updated'}/>}
                            value={filterList[index].length ? filterList[index][0] : dateOptions[0]}
                        />
                },
                filterType: 'custom',
                searchable: false,
                sortDescFirst: true,
            },
        }
    ].map(e => ({
        ...e,
        options: {
            ...e.options,
            display: getColumnState(e.name),
            sortThirdClickReset: true,
        }
    })), [authors, books, dateOptions, genres, types]);

    const options = useMemo(() => ({
        count: count,
        customFooter: () =>
            <Waypoint
                bottomOffset={-400}
                onEnter={() => setCount(row => row + 10)}
                scrollableAncestor={window}
            >
                <tfoot/>
            </Waypoint>,
        customSearchRender: debounceSearchRender(200),
        draggableColumns: {
            enabled: true,
        },
        onFilterChange: () => setCount(20),
        onRowClick: (rowData, {dataIndex}) =>
            setBookData(books[dataIndex]),
        onRowsDelete: (rowsDeleted, data, newTableData) => {
            Promise.all(rowsDeleted.data.map(e => Url.deleteBook(books[e.dataIndex].id)))
                .then(getBooks)
        },
        onTableChange: (action, tableState) => setFilteredItemsLength(tableState.displayData.length),
        onViewColumnsChange: (changedColumn, action) => action === 'add' ?
            setColumnState(changedColumn, true) :
            setColumnState(changedColumn, false),
        pagination: false,
        responsive: 'simple',
        setTableProps: () => ({
            padding: 'none',
            size: 'small',
        }),
        searchPlaceholder: `Search ${filteredItemsLength} items`,
        tableBodyMaxHeight: '100%'
    }), [books, filteredItemsLength, getBooks, count]);

    return <>
        <StyledFab color={'primary'} onClick={() => setSearchBookOpen(true)}>
            <AddIcon/>
        </StyledFab>
        {bookData && <AddBook
            getBooks={getBooks}
            books={books}
            setBooks={setBooks}
            authors={authors}
            setAuthors={setAuthors}
            genres={genres}
            setGenres={setGenres}
            types={types}
            setTypes={setTypes}
            getAuthors={getAuthors}
            getGenres={getGenres}
            getTypes={getTypes}

            bookData={bookData}
            onClose={() => setBookData(null)}
            setAddedSnackbar={setAddedSnackbar}
        />}
        {searchBookOpen && <SearchBooks
            books={books}
            closeSearch={() => setSearchBookOpen(false)}
            handleSearch={handleSearch}
            setBookData={setBookData}
        />}
        <Snackbar
            open={Boolean(addedSnackbar)}
            onClose={() => setAddedSnackbar(false)}
            autoHideDuration={3000}>
            <Alert
                severity={'success'}
                onClose={() => setAddedSnackbar(false)}>
                {addedSnackbar?.message}
            </Alert>
        </Snackbar>
        <StyledTableContainer>
            <ThemeProvider theme={theme => createMuiTheme({
                ...theme,
                overrides: {
                    MUIDataTable: {
                        paper: {
                            backgroundColor: 'transparent'
                        }
                    },
                    MUIDataTableHeadCell: {
                        fixedHeader: {
                            backgroundColor: 'transparent'
                        }
                    },
                    MUIDataTableSelectCell: {
                        headerCell: {
                            backgroundColor: 'transparent'
                        }
                    },
                    MuiGrid: {},
                    MUIDataTableToolbar: {
                        filterPaper: {
                            maxWidth: 'calc(100% - 32px) !important',
                        }
                    }
                }
            })}>

                <MUIDataTable
                    columns={columns}
                    data={books}
                    options={options}
                    title={`${filteredItemsLength} items`}
                />
            </ThemeProvider>
        </StyledTableContainer>
    </>

};
