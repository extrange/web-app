import {TextFieldClearableInfo} from "../../shared/textFieldClearableInfo";
import Cleave from "cleave.js/react";
import React from "react";

const CleaveTextField = ({inputRef, ...props}) =>
    <Cleave
        htmlRef={inputRef}
        {...props}
    />;

/*Textfield with clear and info buttons, and currency formatting
* Permanently shrunk*/
export const TextFieldClearableInfoCurrency = ({info, onClear, onChange, ...props}) => {

    return <TextFieldClearableInfo
        info={info}
        onClear={onClear}
        InputLabelProps={{ shrink: true }}
        InputProps={{
            inputComponent: CleaveTextField,
            inputProps: {
                options: {
                    numeral: true,
                    prefix: '$',
                    rawValueTrimPrefix: true,
                }
            },
            onChange: e => onChange(e.target.rawValue)
        }}
        {...props}
    />
};