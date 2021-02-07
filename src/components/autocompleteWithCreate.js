import {useMemo, useState} from "react";
import {flow} from "lodash";
import {noop, sanitizeString} from "../util";
import {matchSorter} from "match-sorter";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import styled from 'styled-components'
import {Autocomplete} from "@material-ui/lab";

const StyledAutocomplete = styled(Autocomplete)`
  margin: 10px 0;
`

const StyledCircularProgress = styled(CircularProgress)`
  cursor: default;
`

/**
 * Autocomplete with option creation.
 *
 * createOption - function taking a string, creating an object, and returning a Promise resolving with the new object.
 *
 */
export const AutocompleteWithCreate = ({
                                           createOption,
                                           getOptionLabel,
                                           getOptions,
                                           getOptionSelected,
                                           multiple,
                                           onChange,
                                           options,
                                           renderProps,
                                           value,
                                           ...props
                                       }) => {

        let [loading, setLoading] = useState(false);

        // Optimization for filtering through option labels
        const sanitizedOptionLabels = useMemo(() => options.map(flow(getOptionLabel, sanitizeString)), [options, getOptionLabel])

        const filterOptions = (options, state) => {
            //Remove accents, spaces and convert to lowercase before filtering
            let input = sanitizeString(state.inputValue);
            let filtered = matchSorter(options, input, {keys: [getOptionLabel]});

            //Do not suggest blank inputs or existing options (comparing with diacritics stripped)
            if (!input || sanitizedOptionLabels.includes(input))
                return filtered;

            // Suggest adding option (keeping diacritics)
            filtered.push({
                _name: state.inputValue.trim(),
                _isNew: true,
                _justAdded: true,
            })
            return filtered;
        };

        const renderInput = params => <TextField
            {...params}
            {...renderProps}
            InputProps={{
                ...params.InputProps,
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

                // Find the options with _justAdded, call createOption for it and remove the flag
                let el = newValue.find(e => e._justAdded)
                if (el) {
                    setLoading(true)
                    el._justAdded = false
                    createOption(el._name)
                        .then(obj => {
                            // Refresh options with newly added option
                            getOptions()
                            onChange(newValue.map(e => e._name === el._name ? obj : e))
                            setLoading(false)
                        })

                }

            } else if (newValue && newValue._justAdded) {

                // New option added to single value autocomplete
                setLoading(true)
                createOption(newValue._name)
                    .then(obj => {

                        // Refresh options with newly added option
                        getOptions()

                        // Input is disabled while this is happening
                        onChange(obj)
                        setLoading(false)
                    })
            }

            /* Setting newValue here will result in some options having _name, _justAdded, _isNew properties.
            * Submission should be prevented while in such a state.*/
            onChange(newValue)
        };

        return <StyledAutocomplete
            clearOnBlur
            disabled={loading}
            filterOptions={filterOptions}
            freeSolo
            getOptionLabel={getOptionLabel}
            getOptionSelected={getOptionSelected}
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