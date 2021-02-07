import {styled} from "@material-ui/core/styles"
import {Button, InputAdornment, Slide, useScrollTrigger} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import TextField from "@material-ui/core/TextField";

export const HideOnScroll = ({children, target}) => {
    const trigger = useScrollTrigger({threshold: 50, target});
    return <Slide direction={'down'} in={!trigger}>
        {children}
    </Slide>
};

const MuiStyledButton = styled(Button)({
    margin: '10px',
});

/**
 * Plain button with 10px margin
 * @type {function(JSX.Element): *}
 */
export const StyledButton = ({variant, color, onClick, ...props}) => <MuiStyledButton
    variant={variant}
    color={color}
    onClick={onClick}
    {...props}
/>;

const MuiStyledTextField = styled(TextField)({
    margin: '5px 0',
});

/**
 * Textfield with margin, variant='outlined'
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const StyledTextField = props =>
    <MuiStyledTextField
        variant={'outlined'}
        {...props}
    />
;

export const StyledTextFieldClearable = ({onClear, ...props}) =>
    <MuiStyledTextField
        {...props}
        variant={'outlined'}
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

