import {useTable} from "react-table";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    IconButton,
    Popover,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import FilterListIcon from '@material-ui/icons/FilterList';
import styled from 'styled-components'
import {useEffect, useState} from "react";

const TableContainer = styled.div`
  max-width: 1000px;
`

const SearchDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
`

const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    max-width: min(calc(100% - 32px), 600px);
  }
`

export const DataTable = ({columns, data, defaultColumns, onRowClick}) => {

    const [filterAnchor, setFilterAnchor] = useState()

    const {
        allColumns,
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setHiddenColumns,
    } = useTable({
        columns,
        data
    })

    useEffect(() => setHiddenColumns(allColumns.filter(e => !defaultColumns.includes(e.id)).map(e => e.id))
        , [allColumns, defaultColumns, setHiddenColumns])


    return <TableContainer>
        <StyledPopover
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={() => setFilterAnchor(undefined)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}>
            <FormControl>
                <FormLabel>Columns</FormLabel>
                <FormGroup>
                    {allColumns.map(e => <FormControlLabel
                        key={e.id}
                        control={<Checkbox
                            {...e.getToggleHiddenProps()}/>}
                        label={e.Header}/>)}
                </FormGroup>
            </FormControl>

        </StyledPopover>
        <SearchDiv>
            <TextField
                label={'Search'}
                placeholder={'Search XXX items'}
            />
            <IconButton
                onClick={e => setFilterAnchor(e.currentTarget)}>
                <FilterListIcon/>
            </IconButton>
        </SearchDiv>
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
                        onClick: () => onRowClick(row)
                    })}>
                        {row.cells.map(cell =>
                            <TableCell {...cell.getCellProps()}>
                                {cell.render('Cell')}
                            </TableCell>)}
                    </TableRow>
                })}
            </TableBody>
        </Table>
    </TableContainer>
}