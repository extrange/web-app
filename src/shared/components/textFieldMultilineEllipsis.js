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
    const [focusPos, setFocusPos] = useState(0);
    const inputRef = useRef();

    useEffect(() => {
        if (!focused) return
        inputRef.current.focus() // Required to focus on the new textarea
        inputRef.current.setSelectionRange(focusPos, focusPos); // Maintain original cursor position
    }, [focusPos, focused]);

    return <StyledTextField
        {...props}
        $ellipsis={!focused}
        multiline={focused}
        inputRef={inputRef}
        onFocus={e => {
            setFocused(true)
            e.target.selectionStart && setFocusPos(e.target.selectionStart)
        }}
        onBlur={() => setFocused(false)}
    />
};