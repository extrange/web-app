import {
  Checkbox,
  Fab,
  FormControlLabel,
  Snackbar,
  TableContainer,
  TextField,
} from "@material-ui/core";
import {
  ThemeProvider,
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from "@material-ui/core/styles"; //todo replace with v5 when out
import AddIcon from "@material-ui/icons/Add";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import { Alert, Autocomplete } from "@material-ui/lab";
import { isBefore, parseISO, subMonths, subWeeks, subYears } from "date-fns";
import { matchSorter } from "match-sorter";
import MUIDataTable, { debounceSearchRender } from "mui-datatables";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Waypoint } from "react-waypoint";
import styled from "styled-components";
import { BACKGROUND_COLOR } from "../../shared/components/backgroundScreen";
import { formatDistanceToNowPretty } from "../../shared/util";
import { Loading } from "../../shared/components/Loading";
import { AddBook } from "./AddBook";
import {
  useDeleteBookMutation,
  useGetAuthorsQuery,
  useGetBooksQuery,
  useGetGenresQuery,
  useGetTypesQuery,
} from "./literatureApi";
import { selectDisplayedColumns, setDisplayedColumn } from "./literatureSlice";
import { BOOK_FIELDS } from "./schema";
import { SearchBooks } from "./SearchBooks";

const StyledTableContainer = styled(TableContainer)`
  ${BACKGROUND_COLOR};
`;

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

// TODO books in a series should be collapsible

/**
 * Book search, addition, table view/sort
 */
export const Books = () => {
  const dispatch = useDispatch();
  const displayedColumns = useSelector(selectDisplayedColumns);

  /* I have to set a default value, because useMemo below cannot be called conditionally */
  const { data: books = [], isLoading: booksLoading } = useGetBooksQuery();
  const { data: authors = [], isLoading: authorsLoading } =
    useGetAuthorsQuery();
  const { data: genres = [], isLoading: genresLoading } = useGetGenresQuery();
  const { data: types = [], isLoading: typesLoading } = useGetTypesQuery();
  const [deleteBook] = useDeleteBookMutation();

  const [searchBookOpen, setSearchBookOpen] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [addedSnackbar, setAddedSnackbar] = useState(null);
  const [filteredItemsLength, setFilteredItemsLength] = useState();
  const [numBooksToShow, setNumBooksToShow] = useState(10);

  const loading =
    booksLoading || authorsLoading || genresLoading || typesLoading;

  const dateOptions = useMemo(
    () => [
      {
        name: "All",
        date: new Date(0),
      },
      {
        name: "Last week",
        date: subWeeks(new Date(), 1),
      },
      {
        name: "Last month",
        date: subMonths(new Date(), 1),
      },
      {
        name: "Last year",
        date: subYears(new Date(), 1),
      },
    ],
    []
  );

  const options = useMemo(
    () => ({
      count: numBooksToShow,
      customFooter: () => (
        <Waypoint
          bottomOffset={-400}
          scrollableAncestor={"window"}
          onEnter={() => setNumBooksToShow((row) => row + 10)}
        >
          <tfoot />
        </Waypoint>
      ),
      customSearchRender: debounceSearchRender(200),
      draggableColumns: {
        enabled: true,
      },
      onFilterChange: () => setNumBooksToShow(20),
      onRowClick: (rowData, { dataIndex }) => setBookData(books[dataIndex]),
      onRowsDelete: (rowsDeleted, data, newTableData) =>
        rowsDeleted.data.forEach((e) =>
          deleteBook({ id: books[e.dataIndex].id })
        ),
      onTableChange: (action, tableState) =>
        setFilteredItemsLength(tableState.displayData.length),
      onViewColumnsChange: (changedColumn, action) =>
        dispatch(setDisplayedColumn(changedColumn, action === "add")),
      pagination: false,
      responsive: "simple",
      setTableProps: () => ({
        padding: "none",
        size: "small",
      }),
      searchPlaceholder: `Search ${books.length} items`,
      tableBodyMaxHeight: "100%",
    }),
    [books, deleteBook, dispatch, numBooksToShow]
  );

  const columns = useMemo(
    () =>
      [
        {
          label: "Cover",
          name: BOOK_FIELDS.image_url,
          options: {
            filter: false,
            searchable: false,
            sort: false,
            customBodyRenderLite: (dataIndex) =>
              books[dataIndex][BOOK_FIELDS.image_url] ? (
                <img
                  alt={""}
                  src={books[dataIndex][BOOK_FIELDS.image_url]}
                  style={{ maxHeight: "80px" }}
                />
              ) : null,
          },
        },
        {
          label: "Title",
          name: BOOK_FIELDS.title,
          options: {
            filter: false,
          },
        },
        {
          label: "Authors",
          name: BOOK_FIELDS.authors,
          options: {
            customBodyRenderLite: (dataIndex) =>
              books[dataIndex][BOOK_FIELDS.authors]
                .map((id) => authors.find((authors) => authors.id === id)?.name)
                .join(", "),
            customFilterListOptions: {
              render: (val) => val.map((e) => `Author: ${e.name}`),
            },
            filterType: "custom",
            filterOptions: {
              logic: (el, filters) =>
                filters.length && !filters.some((e) => el.includes(e.id)),
              display: (filterList, onChange, index, column) => (
                <Autocomplete
                  autoComplete
                  autoHighlight
                  filterSelectedOptions
                  filterOptions={(options, state) =>
                    matchSorter(options, state.inputValue, {
                      keys: ["name"],
                    }).slice(0, 10)
                  }
                  getOptionLabel={(option) => option.name}
                  multiple
                  onChange={(event, value) => {
                    onChange(value, index, column);
                  }}
                  options={authors}
                  renderInput={(params) => (
                    <TextField {...params} label={"Author"} />
                  )}
                  value={filterList[index]}
                />
              ),
            },
          },
        },
        {
          label: "Genres",
          name: BOOK_FIELDS.genres,
          options: {
            customBodyRenderLite: (dataIndex) =>
              books[dataIndex][BOOK_FIELDS.genres]
                .map((id) => genres.find((genres) => genres.id === id)?.name)
                .join(", "),
            customFilterListOptions: {
              render: (val) => val.map((e) => `Genre: ${e.name}`),
            },
            filterType: "custom",
            filterOptions: {
              logic: (el, filters) =>
                filters.length && !filters.some((e) => el.includes(e.id)),
              display: (filterList, onChange, index, column) => (
                <Autocomplete
                  autoComplete
                  autoHighlight
                  filterSelectedOptions
                  filterOptions={(options, state) =>
                    matchSorter(options, state.inputValue, { keys: ["name"] })
                  }
                  getOptionLabel={(option) => option.name}
                  multiple
                  onChange={(event, value) => {
                    onChange(value, index, column);
                  }}
                  options={genres}
                  renderInput={(params) => (
                    <TextField {...params} label={"Genre"} />
                  )}
                  value={filterList[index]}
                />
              ),
            },
          },
        },
        {
          label: "Type",
          name: BOOK_FIELDS.type,
          options: {
            customBodyRenderLite: (dataIndex) =>
              types.find(
                (type) => type.id === books[dataIndex][BOOK_FIELDS.type]
              )?.name,
            customFilterListOptions: {
              render: (v) =>
                `Type: ${types.find((type) => type.id === v).name}`,
            },
            filterOptions: {
              renderValue: (v) => types.find((type) => type.id === v).name,
            },
            filterType: "multiselect",
          },
        },
        {
          label: "Description",
          name: BOOK_FIELDS.description,
          options: {
            filter: false,
          },
        },
        {
          label: "Date added",
          name: "date_added", // date_added is not in BOOK_FIELDS
          options: {
            customBodyRenderLite: (dataIndex) =>
              formatDistanceToNowPretty(parseISO(books[dataIndex].date_added)), // date_added is not in BOOK_FIELDS
            customFilterListOptions: {
              render: (v) => `Date Added: ${v[0].name}`,
            },
            filterOptions: {
              logic: (el, filters) =>
                filters.length && isBefore(parseISO(el), filters[0].date),
              display: (filterList, onChange, index, column) => (
                <Autocomplete
                  autoComplete
                  autoHighlight
                  getOptionLabel={(e) => e.name}
                  getOptionSelected={(opt, val) => opt.name === val.name}
                  onChange={(event, value) =>
                    onChange(value ? [value] : [], index, column)
                  }
                  options={dateOptions}
                  renderInput={(params) => (
                    <TextField {...params} label={"Date Added"} />
                  )}
                  value={
                    filterList[index].length
                      ? filterList[index][0]
                      : dateOptions[0]
                  }
                />
              ),
            },
            filterType: "custom",
            searchable: false,
            sortDescFirst: true,
          },
        },
        {
          label: "Read Next",
          name: BOOK_FIELDS.read_next,
          options: {
            customBodyRenderLite: (dataIndex) =>
              books[dataIndex][BOOK_FIELDS.read_next] ? (
                <ErrorOutlineOutlinedIcon color={"secondary"} />
              ) : (
                ""
              ),
            customFilterListOptions: {
              render: () => "Read Next",
            },
            filterOptions: {
              logic: (el, filters) => filters.length && !el,
              display: (filterList, onChange, index, column) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(filterList[index][0])}
                      onChange={(e) =>
                        onChange(e.target.checked ? [true] : [], index, column)
                      }
                    />
                  }
                  label={"Read Next"}
                />
              ),
            },
            filterType: "custom",
            searchable: false,
          },
        },
        {
          label: "Date Read",
          name: BOOK_FIELDS.date_read,
          options: {
            customBodyRenderLite: (dataIndex) =>
              books[dataIndex][BOOK_FIELDS.date_read]
                ? formatDistanceToNowPretty(
                    parseISO(books[dataIndex][BOOK_FIELDS.date_read])
                  )
                : "",
            customFilterListOptions: {
              render: (v) => `Date Read: ${v[0].name}`,
            },
            filterOptions: {
              logic: (el, filters) =>
                filters.length &&
                (isBefore(parseISO(el), filters[0].date) || !Boolean(el)),
              display: (filterList, onChange, index, column) => (
                <Autocomplete
                  autoComplete
                  autoHighlight
                  getOptionLabel={(e) => e.name}
                  getOptionSelected={(opt, val) => opt.name === val.name}
                  onChange={(event, value) =>
                    onChange(value ? [value] : [], index, column)
                  }
                  options={dateOptions}
                  renderInput={(params) => (
                    <TextField {...params} label={"Date Read"} />
                  )}
                  value={
                    filterList[index].length
                      ? filterList[index][0]
                      : dateOptions[0]
                  }
                />
              ),
            },
            filterType: "custom",
            searchable: false,
            sortDescFirst: true,
          },
        },

        {
          label: "Published",
          name: BOOK_FIELDS.published,
          options: {
            filter: false,
            sortDescFirst: true,
          },
        },
        {
          label: "Series",
          name: BOOK_FIELDS.series,
          options: {
            customBodyRenderLite: (dataIndex) => {
              let row = books[dataIndex];
              return row[BOOK_FIELDS.series]
                ? `${row[BOOK_FIELDS.series]} #${
                    row[BOOK_FIELDS.series_position]
                  }`
                : "";
            },
            customFilterListOptions: {
              render: (v) => v.map((e) => `Series: ${e}`),
            },
            filterType: "custom",
            filterOptions: {
              logic: (el, filters) =>
                filters.length && !filters.some((e) => e === el),
              display: (filterList, onChange, index, column) => (
                <Autocomplete
                  autoComplete
                  autoHighlight
                  filterSelectedOptions
                  filterOptions={(options, state) =>
                    matchSorter(options, state.inputValue)
                  }
                  multiple
                  onChange={(event, value) => {
                    onChange(value, index, column);
                  }}
                  options={[
                    ...new Set(
                      books
                        .map((e) => e[BOOK_FIELDS.series])
                        .filter((e) => Boolean(e))
                    ),
                  ]}
                  renderInput={(params) => (
                    <TextField {...params} label={"Series"} />
                  )}
                  value={filterList[index]}
                />
              ),
            },
          },
        },
        {
          label: "Rating",
          name: BOOK_FIELDS.rating,
          options: {
            searchable: false,
          },
        },
        {
          label: "My Review",
          name: BOOK_FIELDS.my_review,
          options: {
            filter: false,
          },
        },
        {
          label: "Notes",
          name: BOOK_FIELDS.notes,
          options: {
            filter: false,
          },
        },
        {
          label: "Updated",
          name: "updated",
          options: {
            customBodyRenderLite: (dataIndex) =>
              formatDistanceToNowPretty(parseISO(books[dataIndex].updated)),
            customFilterListOptions: {
              render: (v) => `Updated: ${v[0].name}`,
            },
            filterOptions: {
              logic: (el, filters) =>
                filters.length && isBefore(parseISO(el), filters[0].date),
              display: (filterList, onChange, index, column) => (
                <Autocomplete
                  autoComplete
                  autoHighlight
                  getOptionLabel={(e) => e.name}
                  getOptionSelected={(opt, val) => opt.name === val.name}
                  onChange={(event, value) =>
                    onChange(value ? [value] : [], index, column)
                  }
                  options={dateOptions}
                  renderInput={(params) => (
                    <TextField {...params} label={"Updated"} />
                  )}
                  value={
                    filterList[index].length
                      ? filterList[index][0]
                      : dateOptions[0]
                  }
                />
              ),
            },
            filterType: "custom",
            searchable: false,
            sortDescFirst: true,
          },
        },
      ].map((e) => ({
        ...e,
        options: {
          ...e.options,
          display: !!displayedColumns[e.name],
          sortThirdClickReset: true,
        },
      })),
    [authors, books, dateOptions, displayedColumns, genres, types]
  );

  if (loading) return <Loading fullscreen={false} />;

  return (
    <>
      <StyledFab color={"primary"} onClick={() => setSearchBookOpen(true)}>
        <AddIcon />
      </StyledFab>

      {bookData && (
        <AddBook
          bookData={bookData}
          onClose={() => setBookData(null)}
          setAddedSnackbar={setAddedSnackbar}
        />
      )}

      {searchBookOpen && (
        <SearchBooks
          closeSearch={() => setSearchBookOpen(false)}
          setBookData={setBookData}
        />
      )}

      <Snackbar
        open={Boolean(addedSnackbar)}
        onClose={() => setAddedSnackbar(false)}
        autoHideDuration={3000}
      >
        <Alert severity={"success"} onClose={() => setAddedSnackbar(false)}>
          {addedSnackbar?.message}
        </Alert>
      </Snackbar>
      <StyledTableContainer>
        <ThemeProvider
          theme={(theme) =>
            createMuiTheme({
              ...theme,
              overrides: {
                MUIDataTable: {
                  paper: {
                    backgroundColor: "transparent",
                  },
                },
                MUIDataTableHeadCell: {
                  fixedHeader: {
                    backgroundColor: "transparent",
                  },
                },
                MUIDataTableSelectCell: {
                  headerCell: {
                    backgroundColor: "transparent",
                  },
                },
                MuiGrid: {},
                MUIDataTableToolbar: {
                  filterPaper: {
                    maxWidth: "calc(100% - 32px) !important",
                  },
                },
              },
            })
          }
        >
          <MUIDataTable
            columns={columns}
            data={books}
            options={options}
            title={`${filteredItemsLength || books.length} items`}
          />
        </ThemeProvider>
      </StyledTableContainer>
    </>
  );
};
