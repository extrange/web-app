import {useMemo, useState} from "react";
import {flow} from "lodash";
import {noop, sanitizeString} from "../util/util";
import {matchSorter} from "match-sorter";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import styled from 'styled-components'
import {Autocomplete} from "@material-ui/lab";
import PropTypes from 'prop-types'

const StyledCircularProgress = styled(CircularProgress)`
  cursor: default;
`;
const propTypes = {
    createOption: PropTypes.func,
    getOptionLabel: PropTypes.func,
    getOptions: PropTypes.func.isRequired,
    getOptionSelected: PropTypes.func,
    getValue: PropTypes.func, // Required if multiple=true (to get the current state in a callback)
    maxOptionsToShow: PropTypes.number,
    multiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    renderProps: PropTypes.object, // error state, helper text
    value: PropTypes.any
};

export const AutocompleteWithCreate = ({
                                           createOption,
                                           error, // Not used
                                           getOptionLabel = e => e,
                                           getOptions,
                                           getOptionSelected = (a, b) => a === b,
                                           getValue,
                                           helperText, // Not used
                                           maxOptionsToShow = 10,
                                           multiple = false,
                                           onChange,
                                           options,
                                           renderProps,
                                           value,
                                           ...props
                                       }) => {

        let [loading, setLoading] = useState(false);

        // Optimization for filtering through option labels
        const sanitizedOptionLabels = useMemo(() => options.map(flow(getOptionLabel, sanitizeString)), [options, getOptionLabel]);

        /* Needed for getting option label for single autocomplete when option is being added (i.e. _name is set)*/
        const _getOptionLabel = option => getOptionLabel(option) ?? option._name;

        /* Needed to detect options with _name (e.g. currently being added),
         * otherwise when creating an option while another is being created,
         * useAutocomplete returns 'remove-option' instead*/
        const _getOptionSelected = (option, value) =>
            getOptionSelected(option, value) ||
            /*An option is currently being created.
            * Ternary is needed because undefined === undefined*/
            value._name ? value._name === option._name : false;

        const filterOptions = (options, state) => {
            let input = state.inputValue;
            //matchSorter already removes accents, spaces and converts to lowercase
            let filtered = matchSorter(options, input, {keys: [getOptionLabel]});

            /*Suggest adding option ONLY if input is NOT blank,
            NOT in existing options (comparing with diacritics stripped),
            AND createOption is provided*/
            if (createOption &&
                input &&
                !sanitizedOptionLabels.includes(input)) {
                createOption && filtered.push({
                    _name: state.inputValue.trim(),
                    _isNew: true,
                    _justAdded: true,
                })
            }

            return maxOptionsToShow ? filtered.slice(0, maxOptionsToShow) : filtered //todo add 'Scroll for more' functionality
        };

        const renderInput = params => <TextField
            {...params}
            {...renderProps}
            InputProps={{
                ...params.InputProps,
                ...renderProps?.InputProps,
                endAdornment:
                    <>
                        {loading && <CircularProgress size={20}/>}
                        {params.InputProps.endAdornment}
                    </>
            }}
        />;

        const renderTags = (tagValue, getTagProps) => tagValue.map((option, index) => {
                let {onDelete, ...rest} = getTagProps({index});
                return <Chip
                    {...rest}
                    size={"small"}
                    variant={option._isNew ? 'outlined' : 'default'}
                    onDelete={option._isNew ? noop : onDelete} // onDelete must be set for deleteIcon to appear, but I don't want it to actually delete a newly added option.
                    deleteIcon={option._isNew ? <StyledCircularProgress size={16}/> : null}
                    label={option._isNew ?
                        `Adding ${option._name}...` :
                        getOptionLabel(option)}
                />
            }
        );

        const onOptionChange = (event, newValue) => {
            /* A click will never trigger a 'create-option' event.
             * Only Enter will. So it's useless relying on that.
             *
             * The component must be controlled, or else book search
             * will not be able to add authors.*/


            if (multiple) {

                // Find the options with _justAdded === true, call createOption for it and remove the flag
                let el = newValue.find(e => e._justAdded);
                if (el) {
                    el._justAdded = false;
                    createOption(el._name)
                        .then(obj => {
                            // Refresh options with newly added option
                            getOptions();

                            // Get current state and then replace new option with server returned object (it now has id)
                            onChange(getValue().map(e => e._name === el._name ? obj : e))
                        })

                }

            } else if (newValue && newValue._justAdded) {

                // New option added to single value autocomplete (will be disabled while loading)
                setLoading(true);
                createOption(newValue._name)
                    .then(obj => {

                        // Refresh options with newly added option
                        getOptions();

                        // Input is disabled while this is happening
                        onChange(obj);
                        setLoading(false)
                    })
            }

            /*No new options were created.
            * Setting newValue here will result in some options having _name, _justAdded, _isNew properties.
            * Submission is prevented while in such a state, by Yup schema validation.*/
            onChange(newValue)
        };

        return <Autocomplete
            clearOnBlur // Used together with freeSolo
            disabled={!multiple && loading}
            filterOptions={filterOptions}
            freeSolo // This fixes the 'none of the options match with ...' error
            getOptionLabel={_getOptionLabel}
            getOptionSelected={_getOptionSelected}
            loading={loading}
            multiple={multiple}
            onChange={onOptionChange}
            options={options}
            renderInput={renderInput}
            renderOption={option => option._isNew ? `Add '${option._name}'` : getOptionLabel(option)}
            renderTags={renderTags}
            value={value}
            {...props}
        />
    }
;

AutocompleteWithCreate.propTypes = propTypes;