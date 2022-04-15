import TextField from "@material-ui/core/TextField";
import { InputAdornment } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

export const TextFieldClearable = ({ onChange, ...props }) => (
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
          {props.InputProps?.endAdornment}
        </InputAdornment>
      ),
    }}
  />
);
