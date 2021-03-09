import TextField from "@material-ui/core/TextField";
import {CircularProgress, IconButton, InputAdornment, Tooltip} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import RefreshIcon from '@material-ui/icons/Refresh';
import {noop} from "../../util/util";
import React from "react";

export const TextFieldRefreshLoading = ({onRefresh, onClear, loading, tooltipText = '', onOpen = noop, ...props}) => {

    return <TextField
        {...props}
        InputProps={{
            ...props.InputProps,
            endAdornment:
                <InputAdornment position={'end'}>
                    {loading && <CircularProgress size={20}/>}
                    {props.value &&
                    <ClearIcon style={{cursor: 'pointer'}} onClick={onClear}/>}
                    <InputAdornment position={'end'}>
                        <Tooltip
                            onOpen={onOpen}
                            arrow
                            enterTouchDelay={100}
                            interactive
                            title={tooltipText}>
                            <IconButton onClick={onRefresh}>
                                <RefreshIcon/>
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                    {props.InputProps?.endAdornment}
                </InputAdornment>
        }}
    />
}