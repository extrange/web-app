import {useController} from "react-hook-form";
import React from "react";

/*Helper component for react-hook-form.
Injects error, helperText into the component,
together with some useful props for TextFields.
Also fixes the onClear not revalidating issue.*/
export const ControlHelper = ({control, errors, name, Component, onClear, ...props}) => {

    // Discard 'ref' prop as it causes 'Function components cannot be passed ref...' errors
    const {field: {ref, onBlur, ...fieldProps}} = useController({
        control,
        name
    })

    let controlProps = {
        ...fieldProps,
        ...props,
        onBlur,

        error: Boolean(errors[name]),
        fullWidth: true,
        helperText: errors[name]?.message,
        name,
        size: 'small',
    }

    // Needed to force re-validation after clearing input
    if (onClear) {
        controlProps.onClear = () => {
            onClear();
            onBlur()
        }
    }

    return <Component {...controlProps}/>
}