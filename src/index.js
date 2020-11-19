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
import {LoginCheck} from "./main/loginCheck";
import {Background} from "./components/background";

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

ReactDOM.render(
    <React.StrictMode>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <Background numImages={numImages}/>
            <LoginCheck/>
        </MuiThemeProvider>
    </React.StrictMode>
    , document.getElementById('root'));

serviceWorker.register();