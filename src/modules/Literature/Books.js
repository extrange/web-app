//Books in a series should be collapsible
import {useEffect, useMemo, useState} from 'react';
import {Fab, Snackbar, TableContainer, TextField} from "@material-ui/core";
import styled from 'styled-components'
import {BACKGROUND_COLOR} from "../../shared/backgroundScreen";
import AddIcon from "@material-ui/icons/Add";
import {AddBook} from "./addBook";
import {parseISO} from 'date-fns'
import {Alert, Autocomplete} from "@material-ui/lab";
import * as Url from './urls'
import {formatDistanceToNowPretty} from "../../util/util";
import MUIDataTable from "mui-datatables";
import {matchSorter} from "match-sorter";
import {BOOK_FIELDS} from "./schema";

const StyledTableContainer = styled(TableContainer)`
  ${BACKGROUND_COLOR}
`;

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

const StyledMUIDataTable = styled(MUIDataTable)`
  background-color: transparent;
  
  .MuiTableCell-head {
    background-color: transparent;
  }
;`

const BOOK_COLUMN_STATE = 'BOOK_COLUMN_STATE'

const DEFAULT_COLUMN_STATES = {
    [BOOK_FIELDS.image_url]: true,
    [BOOK_FIELDS.title]: true,
    [BOOK_FIELDS.authors]: true,
    [BOOK_FIELDS.genres]: true,
}

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
    const [addBookOpen, setAddBookOpen] = useState(false)
    const [bookData, setBookData] = useState(null);
    const [addedSnackbar, setAddedSnackbar] = useState(null);

    const getColumnState = column => localStorage.getItem(BOOK_COLUMN_STATE) ?
        JSON.parse(localStorage.getItem(BOOK_COLUMN_STATE))[column] :
        DEFAULT_COLUMN_STATES[column]

    const setColumnState = (column, state) => {
        let columnState = localStorage.getItem(BOOK_COLUMN_STATE)

        if (!columnState) {
            let columnState = JSON.stringify({})
            localStorage.setItem(BOOK_COLUMN_STATE, columnState)
        }

        let parsedColumnState = JSON.parse(columnState)
        localStorage.setItem(BOOK_COLUMN_STATE, JSON.stringify({
            ...parsedColumnState,
            [column]: state
        }));
    }
    const columns = useMemo(() => [
        {
            label: 'Cover',
            name: BOOK_FIELDS.image_url,
            options: {
                filter: false,
                searchable: false,
                sort: false,
                customBodyRenderLite: dataIndex => books[dataIndex][BOOK_FIELDS.image_url] ?
                    <img src={books[dataIndex][BOOK_FIELDS.image_url]}/> : null,
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
                        .map(id => authors.find(authors => authors.id === id).name)
                        .join(', '),
                customFilterListOptions: {
                    render: val => val.map(e => `Author: ${e.name}`)
                },
                filterType: 'custom',
                filterOptions: {
                    logic: (el, filters) => filters.length && !filters.some(e => el.includes(e.id)),
                    display: (filterList, onChange, index, column) => {
                        return <Autocomplete
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
                    }
                },
            }
        },
        {
            label: 'Genres',
            name: BOOK_FIELDS.genres,
            options: {
                customBodyRenderLite: dataIndex => books[dataIndex][BOOK_FIELDS.genres].map(id => genres.find(genres => genres.id === id).name).join(', '),
                customFilterListOptions: {
                    render: val => val.map(e => `Genre: ${e.name}`)
                },
                filterType: 'custom',
                filterOptions: {
                    logic: (el, filters) => filters.length && !filters.some(e => el.includes(e.id)),
                    display: (filterList, onChange, index, column) => {
                        return <Autocomplete
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
                    }
                },
            }
        },
        {
            label: 'Type',
            name: BOOK_FIELDS.type,
            options: {
                customBodyRenderLite: dataIndex => types.find(type => type.id === books[dataIndex][BOOK_FIELDS.type]).name,
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
            name: 'date_added',
            options: {
                customBodyRenderLite: dataIndex => formatDistanceToNowPretty(parseISO(books[dataIndex].date_added)),
                searchable: false,
            }
        },
        {
            label: 'Read Next',
            name: BOOK_FIELDS.read_next,
            options: {
                customFilterListOptions: {
                    render: e => `Read Next: ${e}`
                },
                customBodyRender: value => value ? 'True' : 'False',
                filterType: 'checkbox',
                searchable: false,
            }
        },
        {
            label: 'Date Read',
            name: BOOK_FIELDS.date_read,
            options: {
                customBodyRenderLite: dataIndex => books[dataIndex][BOOK_FIELDS.date_read] ?
                    formatDistanceToNowPretty(parseISO(books[dataIndex][BOOK_FIELDS.date_read])) :
                    'Not yet read',
                searchable: false,
            }
        },

        {
            label: 'Published',
            name: BOOK_FIELDS.published,
        },
        {
            label: 'Series',
            name: BOOK_FIELDS.series,
            options: {
                customBodyRenderLite: dataIndex => {
                    let row = books[dataIndex]
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
                searchable: false,
            }
        }
    ].map(e => ({
        ...e,
        options: {
            ...e.options,
            display: getColumnState(e.name),
            sortThirdClickReset: true,
        }
    })), [authors, books, genres, types])

    const onDelete = (e, id) => Url.deleteBook(id)

    const options = useMemo(() => ({
        draggableColumns: {
            enabled: true,
        },
        fixedHeader: true,
        fixedSelectColumn: true,
        onRowClick: (rowData, {dataIndex}) => {
            setAddBookOpen(true)
            setBookData(books[dataIndex])
        },
        onRowsDelete: (rowsDeleted, data, newTableData) => {
            Promise.all(rowsDeleted.data.map(e => Url.deleteBook(books[e.dataIndex].id)))
                .then(getBooks)
        },
        onViewColumnsChange: (changedColumn, action) => action === 'add' ?
            setColumnState(changedColumn, true) :
            setColumnState(changedColumn, false),
        responsive: 'simple',
    }), [books])

    /*Refetch booklist on initial render*/
    useEffect(() => void getBooks(), [getBooks])

    return <>
        <StyledFab color={'primary'} onClick={() => setAddBookOpen(true)}>
            <AddIcon/>
        </StyledFab>
        {addBookOpen && <AddBook
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
            onClose={() => {
                setAddBookOpen(false)
                setBookData(null)
            }}
            setAddedSnackbar={setAddedSnackbar}
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
            <StyledMUIDataTable
                columns={columns}
                data={books}
                options={options}
            />
        </StyledTableContainer>
    </>

}
