import React from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto/300.css'
import 'fontsource-roboto/400.css'
import 'fontsource-roboto/500.css'
import 'fontsource-roboto/700.css'
import 'fontsource-source-sans-pro' //For codemirror in markdownEditor.js
import {createMuiTheme} from "@material-ui/core/styles";
import {MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import {LoginCheck} from "./main/loginCheck";
import {ServiceWorker} from "./main/serviceWorker";
import {ErrorBoundary} from "./components/errorBoundary";
import styled, {createGlobalStyle} from "styled-components";
import {getDaysSinceEpoch, getRandomInt} from "./util";
import 'overlayscrollbars/css/OverlayScrollbars.css'

/*Largest index of background images, inclusive*/
const numImages = 26;

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
    }
});

const BackgroundTest = createGlobalStyle`
    body {
        background: red;
        background: url(${({numImages}) => `/bg/${getRandomInt(1, numImages, getDaysSinceEpoch())}.jpg`}) top/cover;
        background-attachment: fixed;
        overflow-x: hidden;
    }
`;

const BackgroundScreen = styled.div`
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
`;


ReactDOM.render(
    <React.StrictMode>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <BackgroundTest numImages={numImages}/>
            <BackgroundScreen/>
            <ErrorBoundary>
                <ServiceWorker/>
                <LoginCheck/>
            </ErrorBoundary>
        </MuiThemeProvider>
    </React.StrictMode>
    , document.getElementById('root'));



