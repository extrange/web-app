import {styled} from "@material-ui/core/styles"
import {useEffect, useState} from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {Button, InputAdornment, Slide, useScrollTrigger} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import ClearIcon from "@material-ui/icons/Clear";
import {sanitizeString} from "../util";
import TextField from "@material-ui/core/TextField";
import {matchSorter} from "match-sorter";

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

const MuiStyledAutocompleteMultiSort = styled(Autocomplete)({
    margin: '10px 0',
});

/**
 * Autocomplete with margins, match-sort, only suggests addition of input if not in option list <br>
 * Will be in 'loading' state until options fully loaded <br>
 * Will call refreshOptions on successfully adding a new option to refresh option list <br>
 * Supports multiple/single inputs
 *
 * @param displayKey key of object to use as display name
 * @param searchKeys [] of keys to search in object during typing
 * @param multiple whether to allow multiple options
 * @param value array of values currently selected in autocomplete
 * @param setValue
 * @param label Title of autocomplete
 * @param callback function(newName: string) => object. Called when new option is added
 * @param options [] of objects
 * @param refreshOptions function to call to trigger refetching options from server. Should update options.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const StyledAutocompleteMultiSort = ({
                                                displayKey = 'name',
                                                searchKeys = ['name'],
                                                multiple = true,
                                                value,
                                                setValue,
                                                label,
                                                callback,
                                                options,
                                                refreshOptions,
                                                getValues,
                                                renderProps,
                                                ...props
                                            }) => {

    let [loading, setLoading] = useState(true);
    useEffect(() => setLoading(options.length < 1), [options]); //todo this will display a loading sign when there are no options, even if loaded

    return <MuiStyledAutocompleteMultiSort
        {...props}
        autoComplete
        autoHighlight
        multiple={multiple}
        filterSelectedOptions
        loading={loading}
        value={value}
        options={options}
        getOptionSelected={(option, value) => option[displayKey] === value[displayKey]}
        renderOption={option => {
            return option.isNew ?
                `Add '${option[displayKey]}'` :
                option[displayKey];
        }}
        getOptionLabel={option => option[displayKey]}
        renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
                    let {onDelete, ...rest} = getTagProps({index});
                    //todo Improve this - don't use onDelete with an empty lambda just to show an icon on the right
                    return <Chip
                        {...rest}
                        size={"small"}
                        variant={option.isNew ? 'outlined' : 'default'}
                        onDelete={option.isNew ? () => null : onDelete}
                        deleteIcon={option.isNew ? <CircularProgress size={16}
                                                                     style={{cursor: 'default'}}/> : null} //todo don't use inline styles, use withStyles or muiStyled
                        label={option.isNew ?
                            `Adding ${option[displayKey]}...` :
                            option[displayKey]}
                    />
                }
            )
        }
        onChange={(event, newValue) => {
            //Single value
            if (newValue && newValue.justAdded) {
                newValue.justAdded = false;
                setLoading(true);
                callback(newValue).then(result => {
                    refreshOptions();
                    setValue(result);
                    setLoading(false)
                })
            } else if (Array.isArray(newValue)) {
                //Array
                let idx = newValue.findIndex(e => e.justAdded);
                if (idx !== -1) { //New element added

                    //remove justAdded property
                    let val = newValue[idx];
                    val.justAdded = false;
                    callback(val).then(result => {
                        refreshOptions();
                        //replace old value with server result
                        setValue(getValues().map(e => e[displayKey] === val[displayKey] ? result : e));
                    });
                }
            }
            setValue(newValue);
        }}
        filterOptions={(options, state) => {
            //Remove accents, spaces and convert to lowercase
            let sanitizedInput = sanitizeString(state.inputValue);

            //Use match-sorter to filter sanitized input with searchKeys
            let filtered = matchSorter(options, sanitizedInput, {keys: searchKeys});

            //Sanitize option names before comparing with sanitized input
            let sanitizedOptions = filtered.map(e => sanitizeString(e[displayKey]));

            //Do not suggest existing names (regardless of capitalization) nor blank inputs
            if (sanitizedOptions.includes(sanitizedInput) || !sanitizedInput)
                return filtered;


            if (Array.isArray(value)) {
                //Only suggest if not already selected
                if (!value.find(e => sanitizeString(e[displayKey]) === sanitizedInput)) {
                    filtered.push({
                        [displayKey]: state.inputValue.trim(),
                        isNew: true,
                        justAdded: true
                    });
                }
            } else {
                //Suggest if nothing is selected or current value is not equal to input
                if (!value || sanitizeString(value[displayKey]) !== sanitizedInput) {
                    filtered.push({
                        [displayKey]: state.inputValue.trim(),
                        isNew: true,
                        justAdded: true
                    });
                }
            }

            return filtered;
        }}
        renderInput={params =>
            <TextField
                {...params}
                {...renderProps}
                variant={'outlined'}
                label={label}
                InputProps={{
                    ...params.InputProps,
                    endAdornment:
                        <>
                            {loading && <CircularProgress size={20}/>}
                            {params.InputProps.endAdornment}
                        </>
                }}
            />
        }
    />
};

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

export const noop = () => {
};