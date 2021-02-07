//Books in a series should be collapsible
import {useMemo, useState} from 'react';
import {useTable} from 'react-table'
import {Fab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import styled from 'styled-components'
import {BACKGROUND_COLOR} from "../components/backgroundScreen";
import AddIcon from "@material-ui/icons/Add";
import {AddBook} from "./addBook";
import {formatDistanceToNow, parseISO} from 'date-fns'
import {transformToUserInput} from "./schema";

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
                          refreshBooks,
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
    const [editingBook, setEditingBook] = useState(null);
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
            getBooks={refreshBooks}
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

            onClose={() => setAddBookOpen(false)}
            editingBook={editingBook}
        />}
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
                                setEditingBook(transformToUserInput({
                                    data: row.original,
                                    authors,
                                    genres,
                                    types
                                }))
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
