import ReactDOM from 'react-dom';
import {StrictMode} from "react";
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/source-sans-pro' //For codemirror in MarkdownEditor.js
import './fonts/starcraft/starcraft.css' //Stylized font for menu
import {MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import {LoadServiceWorker} from "./LoadServiceWorker";
import {ErrorBoundary} from "./ErrorBoundary";
import 'overlayscrollbars/css/OverlayScrollbars.css'
import {theme} from "./globals/theme";
import {RandomBackground} from "./shared/randomBackground";
import {LoginCheckAndNetworkState} from "./LoginCheckAndNetworkState";
import {HTML5Backend} from 'react-dnd-html5-backend'
import {DndProvider} from 'react-dnd'

/*Decide whether to run mock service worker for debugging*/
const USE_MOCK_SERVICE_WORKER = false;
if (process.env.NODE_ENV === 'development' && USE_MOCK_SERVICE_WORKER) {
    const {worker} = require('./test/mocks/browser');
    worker.start()
}

ReactDOM.render(
    <StrictMode>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <RandomBackground/>
            <ErrorBoundary>
                <DndProvider backend={HTML5Backend}>
                    <LoadServiceWorker/>
                    <LoginCheckAndNetworkState/>
                </DndProvider>
            </ErrorBoundary>
        </MuiThemeProvider>
    </StrictMode>
    , document.getElementById('root'));



