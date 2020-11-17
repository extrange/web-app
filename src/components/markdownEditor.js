import React from "react";
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css'
import './codemirror.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/selection/mark-selection'
import 'codemirror/addon/selection/active-line'

export const MarkdownEditor = ({value, setValue}) => {

    return <CodeMirror
        value={value}
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
        onBeforeChange={(editor, data, newValue) => {
            setValue(newValue)
        }}
    />
};