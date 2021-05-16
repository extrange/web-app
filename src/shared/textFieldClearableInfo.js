import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import {IconButton, InputAdornment, Tooltip} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import ClearIcon from "@material-ui/icons/Clear";

/*Textfield with clear and info buttons*/
export const TextFieldClearableInfo = ({info, onChange, ...props}) => {

    return <TextField
        {...props}
        onChange={onChange}
        InputProps={{
            ...props.InputProps,
            endAdornment:
                <InputAdornment position={'end'}>
                    {props.value &&
                    <ClearIcon style={{cursor: 'pointer'}} onClick={() => onChange('')}/>}
                    {info && <InputAdornment position={'end'}>
                        <Tooltip
                            arrow
                            enterTouchDelay={100}
                            interactive
                            title={info}>
                            <IconButton tabIndex={-1}>
                                <InfoOutlinedIcon/>
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>}
                    {props.InputProps?.endAdornment}
                </InputAdornment>
        }}
    />
};