import ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/theme-one_dark";
import { useEffect, useRef } from "react";
import { throttle} from "lodash";

/* Does not work with proportional fonts as of 7/4/22 */
export const MarkdownEditor = ({ defaultValue, onChange }) => {
  const divRef = useRef();

  useEffect(() => {
    const editor = ace.edit("editor", {
      autoScrollEditorIntoView: true, //scroll on selection
      fontFamily: 'Consolas',
      fontSize: 15,
      indentedSoftWrap: false,
      maxLines: Number.MAX_SAFE_INTEGER,
      minLines: 1,
      showPrintMargin: false,
      theme: "ace/theme/one_dark",
      wrap: true,
    });

    editor.setValue(defaultValue);
    editor.resize(true);

    /* Force editor.resize() on resizing element */
    const observer = new ResizeObserver(
      throttle(
        () => {
          console.log("called");
          editor.resize();
        },
        100,
      )
    );
    observer.observe(divRef.current);

    return () => {
      editor.destroy();
      editor.container.remove();
      observer.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div
      id={"editor"}
      ref={divRef}
    />
  );
};
