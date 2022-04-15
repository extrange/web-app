import TextField from "@material-ui/core/TextField";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import CachedIcon from "@material-ui/icons/Cached";
import { noop } from "../../shared/util";
import React from "react";

export const TextFieldRefreshLoading = ({
  onChange,
  onRefresh,
  loading,
  tooltipText = "",
  onOpen = noop,
  ...props
}) => {
  return (
    <TextField
      {...props}
      onChange={onChange}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position={"end"}>
            {props.value && (
              <ClearIcon
                style={{ cursor: "pointer" }}
                onClick={() => onChange("")}
              />
            )}
            <InputAdornment position={"end"}>
              <Tooltip
                onOpen={onOpen}
                arrow
                enterTouchDelay={100}
                interactive
                title={tooltipText}
              >
                <IconButton onClick={onRefresh}>
                  {loading ? <CircularProgress size={20} /> : <CachedIcon />}
                </IconButton>
              </Tooltip>
            </InputAdornment>
            {props.InputProps?.endAdornment}
          </InputAdornment>
        ),
      }}
    />
  );
};
