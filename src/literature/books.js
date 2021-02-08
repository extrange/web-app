//Books in a series should be collapsible
import {useMemo, useState} from 'react';
import {useTable} from 'react-table'
import {Fab, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import styled from 'styled-components'
import {BACKGROUND_COLOR} from "../components/backgroundScreen";
import AddIcon from "@material-ui/icons/Add";
import {AddBook} from "./addBook";
import {formatDistanceToNow, parseISO} from 'date-fns'
import {Alert} from "@material-ui/lab";
import {DialogBlurResponsive} from "../components/dialogBlurResponsive";

const StyledTableContainer = styled(TableContainer)`
  ${BACKGROUND_COLOR}
`;

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

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
    const data = useMemo(() => books, [books])
    const columns = useMemo(() => [
        {
            Header: 'Title',
            accessor: 'title'
        },
        {
            Header: 'Authors',
            accessor: row => row?.authors?.map(id => authors.filter(authors => authors.id === id)[0]?.name).join(', ')
        },
        {
            Header: 'Date added',
            accessor: row => formatDistanceToNow(parseISO(row.date_added), {addSuffix: true})
        }
    ], [authors])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data
    })

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
            <Table {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column =>
                            <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>)}
                    </TableRow>)}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row)
                        return <TableRow {...row.getRowProps({
                            hover: true,
                            onClick: () => {
                                setAddBookOpen(true)
                                setBookData(row.original)
                            }
                        })}>
                            {row.cells.map(cell => <TableCell {...cell.getCellProps()}>
                                {cell.render('Cell')}
                            </TableCell>)}
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </StyledTableContainer>
    </>

}
