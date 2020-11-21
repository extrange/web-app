import React from "react";
import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css'
import './codemirror.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/selection/mark-selection'
import 'codemirror/addon/selection/active-line'


/*
 * Uncontrolled. defaultValue should not trigger re-renders.
 */
export const MarkdownEditor = ({defaultValue, onChange}) => {
    return <CodeMirror
        value={defaultValue}
        options={{
            theme: 'codemirror',
            mode: {
                name: 'gfm',
                highlightFormatting: true,
            },
            lineNumbers: true,
            lineWrapping: true,
            indentWithTabs: true,
            viewportMargin: Infinity,
            autoCloseBrackets: true,
            matchBrackets: true,
            styleSelectedText: true,
            styleActiveLine: true,
        }}
        onChange={(editor, data, newValue) => {
            onChange(newValue)
        }}
    />
};