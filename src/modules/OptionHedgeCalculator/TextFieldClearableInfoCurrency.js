import {TextFieldClearableInfo} from "../../common/textFieldClearableInfo";
import Cleave from "cleave.js/react";
import React from "react";

const CleaveTextField = ({inputRef, ...props}) =>
    <Cleave
        htmlRef={inputRef}
        {...props}
    />;

/*Textfield with clear and info buttons, and currency formatting
* Permanently shrunk*/
export const TextFieldClearableInfoCurrency = ({info, onChange, InputProps, ...props}) => {

    return <TextFieldClearableInfo
        {...props}
        info={info}
        InputLabelProps={{ shrink: true }}
        InputProps={{
            ...InputProps,
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
        onChange={onChange}
    />
};