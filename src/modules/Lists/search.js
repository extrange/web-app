import {useInput} from "../../../util";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import styled from "styled-components";
import {TextField} from "@material-ui/core";

const StyledTextField = styled(TextField)`
  margin: 5px 0;
`;

export const Search = ({filter}) => {
    let {bind, onChange} = useInput();

    let handleInputChange = e => {
        onChange(e);
        filter(e.currentTarget.value);
    };

    return <StyledTextField
        {...bind('search')}
        placeholder="Search"
        variant={'outlined'}
        onChange={handleInputChange}
        InputProps={{
            startAdornment: <InputAdornment position={'start'}>
                <SearchIcon/>
            </InputAdornment>
        }}/>

};
