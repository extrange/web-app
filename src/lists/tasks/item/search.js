import {StyledTextField} from "../../../components/common";
import {useInput} from "../../../util";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";

export const Search = ({filter}) => {
    let {bind, onChange} = useInput();

    let handleInputChange = e => {
        onChange(e);
        filter(e.currentTarget.value);
    };

    return <StyledTextField
        {...bind('search')}
        placeholder="Search"
        onChange={handleInputChange}
        InputProps={{
            startAdornment: <InputAdornment position={'start'}>
                <SearchIcon/>
            </InputAdornment>
        }}/>

};
