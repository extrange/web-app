import React, {useState} from "react";
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css'
import './codemirror.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import {Remarkable} from "remarkable";
import {Paper} from '@material-ui/core';
import DOMPurify from 'dompurify';
import muiStyled from "@material-ui/core/styles/styled"


const remarkable = new Remarkable({breaks: true});

const StyledPaper = muiStyled(Paper)({
    'min-height': '50px',
});

export const MarkdownEditor = ({value, setValue}) => {
    const [editing, setEditing] = useState(false);

    let renderedMarkdown = value ? DOMPurify.sanitize(remarkable.render(value)) : remarkable.render('Add notes...');

    return <>
        {editing ?
            <CodeMirror
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
                    autoCloseBrackets:true,
                    matchBrackets: true,
                }}
                onBeforeChange={(editor, data, newValue) => {
                    setValue(newValue)
                }}
                onBlur={() => setEditing(false)}
            /> :
                <StyledPaper onClick={() => setEditing(true)} dangerouslySetInnerHTML={{__html: renderedMarkdown}}>
            </StyledPaper>
                }
    </>
};