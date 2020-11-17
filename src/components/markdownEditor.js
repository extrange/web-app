import React, {useState} from "react";
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css'
import './codemirror.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'

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
            autofocus: true,
            lineWrapping: true,
            indentWithTabs: true,
            viewportMargin: Infinity,
            autoCloseBrackets: true,
            matchBrackets: true,
        }}
        onBeforeChange={(editor, data, newValue) => {
            setValue(newValue)
        }}
    />
};