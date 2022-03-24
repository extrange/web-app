import { Button, CircularProgress, TextField } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from "@material-ui/lab";
import { mergeWith } from "lodash";
import { matchSorter } from "match-sorter";
import styled from "styled-components";
import { DialogBlurResponsive } from "../../shared/components/DialogBlurResponsive";
import { sanitizeString } from "../../shared/util";
import { BookResult } from "./BookResult";
import { useGetAuthorsQuery, useGetBooksQuery, useGoodreadsBookInfoMutation, useGoogleBookInfoMutation, useSearchBookMutation } from './literatureApi';
import { BOOK_FIELDS, DEFAULT_BOOK_VALUES } from "./schema";

const BookResults = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
  gap: 10px 10px;
  margin: 10px 0;
`;

const StyledForm = styled.form`
  padding: 10px 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SearchBooks = ({ closeSearch, setBookData }) => {

    const { data: authors = [] } = useGetAuthorsQuery()
    const { data: books = [] } = useGetBooksQuery()

    /* Mutation, because I don't want cached results
    (data is reset to undefined on trigger() for mutations) */
    const [search, { data: searchResults, isLoading: searchLoading }] = useSearchBookMutation()
    // These methods get 'published', 'series_name', 'series_position', 'description'
    const [getGoogleBookInfo, { isLoading: googleBookInfoLoading }] = useGoogleBookInfoMutation()
    const [getGoodreadsBookInfo, { isLoading: goodreadsBookInfoLoading }] = useGoodreadsBookInfoMutation()

    /* Get book description from results, and add new authors 
    Returns filled book template for use in AddBooks*/
    /* TODO Note: Goodreads is getting deprecated...*/
    const getBookInfoAndCreateAuthors = async book => {
        const {
            from,
            goodreads_work_id: workId,
            goodreads_book_id: bookId,
            ISBN_10,
            ISBN_13
        } = book;

        const searchMutation = from === 'google' ?
            // Use ISBN_13 if available, otherwise ISBN_10
            getGoogleBookInfo(ISBN_13 || ISBN_10) :
            getGoodreadsBookInfo({ workId, bookId })

        const apiBookInfo = await searchMutation.unwrap()

        //Prefer api values (srcVal) over existing values (objVal)
        const mergedBook = mergeWith({}, book, apiBookInfo, (objVal, srcVal) => srcVal || objVal);

        const existingAuthors = []; // [] of {id, name, notes}
        const authorsToCreate = []; // [] of String

        mergedBook.authors.forEach(mergedBookAuthor => {
            /* Check if authors in the book result already exist */
            const author = authors.find(existingAuthor => sanitizeString(existingAuthor.name) === sanitizeString(mergedBookAuthor));
            if (author) {
                // Author already exists, push id
                existingAuthors.push(author.id)
            } else {
                // Author doesn't exist, to create
                /* authorsToCreate is made in a format which will trigger creation upon passing to AutocompleteWithCreate */
                authorsToCreate.push({_justAdded: true, _name: mergedBookAuthor, _isNew: true})
            }
        });

        /* Generate a book template from default values */
        const bookTemplate = Object.assign({}, DEFAULT_BOOK_VALUES);

        /* Then copy selected truthy properties from mergedBook */
        [
            BOOK_FIELDS.description,
            BOOK_FIELDS.google_id,
            BOOK_FIELDS.goodreads_book_id,
            BOOK_FIELDS.image_url,
            BOOK_FIELDS.published,
            BOOK_FIELDS.title,
            BOOK_FIELDS.series,
            BOOK_FIELDS.series_position
        ].forEach(e => mergedBook[e] && (bookTemplate[e] = mergedBook[e]));
        
        bookTemplate[BOOK_FIELDS.authors] = [...existingAuthors, ...authorsToCreate];
        return bookTemplate
    }

    const onSearch = e => {
        e.preventDefault();
        search(e.target.elements.search.value)
    };

    const onSearchResultClick = book => {
        getBookInfoAndCreateAuthors(book)
            .then(r => {
                setBookData(r);
                closeSearch()
            })
    };

    const footer = <Footer>
        <Button
            onClick={() => {
                setBookData({});
                closeSearch()
            }}>
            Add manually
        </Button>
        <Button
            onClick={closeSearch}
            color={'primary'}>
            Close
        </Button>
    </Footer>;

    return <>
        <DialogBlurResponsive
            open
            onClose={closeSearch}
            footer={footer}>
            <StyledForm onSubmit={onSearch}>
                <Autocomplete
                    autoComplete
                    filterSelectedOptions
                    filterOptions={(options, state) => state.inputValue ?
                        matchSorter(options, state.inputValue.trim()).slice(0, 3) : []}
                    freeSolo
                    options={books.map(e => e.title)}
                    renderInput={params => <TextField
                        {...params}
                        autoFocus
                        disabled={searchLoading}
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: <SearchIcon />,
                            endAdornment: <>
                                {searchLoading && <CircularProgress size={25} />}
                                {params.InputProps.endAdornment}
                            </>
                        }}
                        label={'Search'}
                        name={'search'}
                        variant={'outlined'}
                    />}
                />
            </StyledForm>
            {searchResults && <BookResults>
                {searchResults.map((result, idx) => {
                    return <BookResult
                        result={result}
                        onSearchResultClick={onSearchResultClick}
                        searchLoading={googleBookInfoLoading || goodreadsBookInfoLoading}
                        key={idx}
                    />
                })}
            </BookResults>}
        </DialogBlurResponsive>
    </>
};