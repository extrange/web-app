import {useReducer} from "react";

/**
 * Uses useReducer (setValue is dispatch({name, value})
 * value can be a function, which will receive the latest state[key] as an argument.
 * If initial state for a key is not set, returns '' by default.
 * @param initialValues initial value of inputs as an object of name: value pairs
 * @returns {{bind: (function(*=): {onChange: function(*): *, name: *, value}), onChange: (function(*): *), setValues: *, values: React.ReducerStateWithoutAction<function(*=, *): (*)>}}
 */
export const useInput = (initialValues = {}) => {
    const reducer = (state, action) => {
        if (typeof action.value === 'function') {
            return {
                ...state,
                [action.name]: action.value(state[action.name])
            }
        } else
            return {
                ...state,
                [action.name]: action.value
            };
    };

    const [values, setValue] = useReducer(reducer, initialValues);

    const onChange = e => setValue({
        name: e.target.name,
        value: e.target.value
    });

    const bind = name => ({
        onChange,
        name: name,
        value: values[name] || ''
    });

    return {values, setValue, onChange, bind}

};