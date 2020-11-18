import React from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto/300.css'
import 'fontsource-roboto/400.css'
import 'fontsource-roboto/500.css'
import 'fontsource-roboto/700.css'
import 'fontsource-source-sans-pro' //For codemirror in markdownEditor.js
import {createMuiTheme} from "@material-ui/core/styles";
import * as serviceWorker from "./serviceWorker";
import {MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import styled from 'styled-components'
import bg from './bg.webp'
import {LoginCheck} from "./main/loginCheck";

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

const Background = styled.div`
    background: url(${bg}) top/cover;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: -1;
`;

const BackgroundHolder = styled.div`
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
            <Background/>
            <BackgroundHolder/>
            <LoginCheck/>
        </MuiThemeProvider>
    </React.StrictMode>
    , document.getElementById('root'));

serviceWorker.register();