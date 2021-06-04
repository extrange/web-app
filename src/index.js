import ReactDOM from 'react-dom';
import React, {StrictMode} from "react";
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/source-sans-pro' //For codemirror in MarkdownEditor.js
import './common/fonts/starcraft/starcraft.css' //Stylized font for menu
import {MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import {LoadServiceWorker} from "./app/LoadServiceWorker";
import {ErrorBoundary} from "./app/ErrorBoundary";
import 'overlayscrollbars/css/OverlayScrollbars.css'
import {theme} from "./app/theme";
import {RandomBackground} from "./common/randomBackground";
import {App} from "./app/App";
import {Provider} from 'react-redux'
import store from './app/store'
import {NetworkError} from "./app/network/NetworkError";

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
                <Provider store={store}>
                    <LoadServiceWorker/>
                    <NetworkError/>
                    <App/>
                </Provider>
            </ErrorBoundary>
        </MuiThemeProvider>
    </StrictMode>
    , document.getElementById('root'));



