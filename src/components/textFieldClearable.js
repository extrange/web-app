import TextField from "@material-ui/core/TextField";
import {InputAdornment} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

export const TextFieldClearable = ({onClear, ...props}) =>
    <TextField
        {...props}
        InputProps={{
            ...props.InputProps,
            endAdornment:
                <InputAdornment position={'end'}>
                    {props.value &&
                    <ClearIcon style={{cursor: 'pointer'}} onClick={onClear}/>}
                    {props.InputProps?.endAdornment}
                </InputAdornment>
        }}
    />
;