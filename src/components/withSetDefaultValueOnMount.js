import { useEffect, useState } from "react";

/**
 * Sets values only on the first render. Injected as defaultValue.
 * Receives prop 'getInitialValue: fn' which is called only on first render and passed to Component as defaultValue.
 */
export const withSetDefaultValueOnMount = Component => ({getInitialValue, ...props}) => {
    const [initialVal, setInitialVal] = useState(null);
    useEffect(() => setInitialVal(getInitialValue()), [getInitialValue]);

    return <Component
        defaultValue={initialVal}
        {...props}
    />
};