import {UnControlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css'
import './codemirror.css'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/selection/mark-selection'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/display/autorefresh'
import './scrollPastEnd'
import {useEffect, useState} from "react";


/*
 * Uncontrolled component. Modifying defaultValue after first mount will not trigger re-renders.
 */
export const MarkdownEditor = ({defaultValue, onChange}) => {

    const [instance, setInstance] = useState(null);
    const [initialValue, setInitialValue] = useState();
    const [loaded, setLoaded] = useState(false);

    /*Necessary to fix wrong Codemirror-sizer instance when mounted within
    an OverlayScrollbars component with lineWrapping: true*/
    useEffect(() => instance?.refresh(), [instance]);

    // Set default value on first mount, and ignore all further updates

    useEffect(() => {
        setInitialValue(defaultValue);
        setLoaded(true)
        // eslint-disable-next-line
    }, []);

    return loaded
        ? <CodeMirror
            value={initialValue}
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
                autoRefresh: true,
                scrollPastEnd: true

            }}
            editorDidMount={editor => setInstance(editor)}
            onChange={(editor, data, newValue) => {

                onChange(newValue);
            }}
        />
        : null
};
