import CodeMirror from "codemirror/lib/codemirror";

const updateBottomMargin = cm => {

    // Fixed 300px of virtual height if lineCount > 1
    let padding = '';

    if (cm.lineCount() > 1) {
        // const totalH = cm.display.scroller.clientHeight - 30,
        //     lastLineH = cm.getLineHandle(cm.lastLine()).height;
        // padding = (totalH - lastLineH) + "px";
        padding = '300px';
    }

    if (cm.state.scrollPastEndPadding !== padding) {
        cm.state.scrollPastEndPadding = padding;
        cm.display.lineSpace.parentNode.style.paddingBottom = padding;
        cm.off("refresh", updateBottomMargin);
        cm.setSize();
        cm.on("refresh", updateBottomMargin);
    }
};

const onChange = (cm, change) => {
    if (CodeMirror.changeEnd(change).line === cm.lastLine())
        updateBottomMargin(cm);
};


CodeMirror.defineOption("scrollPastEnd", false, (cm, val, old) => {

    // I think this turns off the mode
    if (old && old !== CodeMirror.Init) {
        cm.off("change", onChange);
        cm.off("refresh", updateBottomMargin);
        cm.display.lineSpace.parentNode.style.paddingBottom = "";
        cm.state.scrollPastEndPadding = null;
    }

    if (val) {
        cm.on("change", onChange);
        cm.on("refresh", updateBottomMargin);
        updateBottomMargin(cm);
    }
});