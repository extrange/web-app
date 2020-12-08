import React from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto/300.css'
import 'fontsource-roboto/400.css'
import 'fontsource-roboto/500.css'
import 'fontsource-roboto/700.css'
import 'fontsource-source-sans-pro' //For codemirror in markdownEditor.js
import {MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import {LoginCheck} from "./main/loginCheck";
import {ServiceWorker} from "./main/serviceWorker";
import {ErrorBoundary} from "./components/errorBoundary";
import 'overlayscrollbars/css/OverlayScrollbars.css'
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {OverlayScrollbarOptions, theme} from "./globalConstants";
import {RandomBackground} from "./components/randomBackground";

/*Largest index of background images, inclusive*/
const numImages = 26;

ReactDOM.render(
    <React.StrictMode>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <RandomBackground numImages={numImages}/>
            <ErrorBoundary>
                <ServiceWorker/>

                <OverlayScrollbarsComponent
                    options={OverlayScrollbarOptions}>
                    <LoginCheck/>
                </OverlayScrollbarsComponent>

            </ErrorBoundary>
        </MuiThemeProvider>
    </React.StrictMode>
    , document.getElementById('root'));



