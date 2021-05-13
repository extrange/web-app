import {BookResult} from "./BookResult";
import styled from "styled-components";
import {Button, CircularProgress, TextField} from "@material-ui/core";
import {Networking} from "../../util/networking";
import * as Url from "./urls";
import {useState} from "react";
import {DialogBlurResponsive} from "../../shared/dialogBlurResponsive";
import SearchIcon from '@material-ui/icons/Search';
import {Autocomplete} from "@material-ui/lab";
import {matchSorter} from "match-sorter";

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

export const SearchBooks = ({books, closeSearch, handleSearch, setBookData}) => {

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const onSearch = event => {
        event.preventDefault();
        setResults(null);
        setLoading(true);
        console.log(event.target.elements);
        let query = event.target.elements.search.value;
        Networking.send(`${Url.SEARCH}?q=${query}`, {method: 'GET'})
            .then(resp => resp.json())
            .then(json => {
                setResults(json.results);
                setLoading(false)
            });
    };

    const onSearchResultClick = result => {
        setLoading(true);
        handleSearch(result)
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
                        matchSorter(options, state.inputValue).slice(0, 3) : []}
                    freeSolo
                    options={books.map(e => e.title)}
                    renderInput={params => <TextField
                        {...params}
                        autoFocus
                        disabled={loading}
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: <SearchIcon/>,
                            endAdornment: <>
                                {loading && <CircularProgress size={25}/>}
                                {params.InputProps.endAdornment}
                            </>
                        }}
                        label={'Search'}
                        name={'search'}
                        variant={'outlined'}
                    />}
                />
            </StyledForm>
            {results && <BookResults>
                {results.map((result, idx) => {
                    return <BookResult
                        result={result}
                        onSearchResultClick={onSearchResultClick}
                        searchLoading={loading}
                        key={idx}
                    />
                })}
            </BookResults>}
        </DialogBlurResponsive>
    </>
};