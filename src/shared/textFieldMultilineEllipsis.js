import {TextField} from "@material-ui/core";
import {useEffect, useRef, useState} from "react";
import styled from "styled-components";

const StyledTextField = styled(TextField)`
  
  ${({$ellipsis}) => $ellipsis ? `
  .MuiInputBase-input {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }`: null}
`;

/*TextField which switches to multiline when focused, and singleline with ellipsis otherwise.*/
export const TextFieldMultilineEllipsis = ({onBlur, onFocus, ...props}) => {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef();

    useEffect(() => focused ? inputRef.current.focus() : null);

    return <StyledTextField
        {...props}
        $ellipsis={!focused}
        multiline={focused}
        inputRef={inputRef}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
    />
};