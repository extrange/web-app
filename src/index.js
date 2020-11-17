import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import 'fontsource-source-sans-pro'
import 'fontsource-jetbrains-mono'
import {Login} from "./login";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import * as serviceWorker from "./serviceWorker";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
            '"Source Sans Pro"',
            'sans-serif',
        ].join(','),
    },
    palette: {
        type: "dark"
    }
});

const App = () => (
    <MuiThemeProvider theme={theme}>
        <CssBaseline/>
        <Login/>
    </MuiThemeProvider>
);

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
    , document.getElementById('root'));
serviceWorker.register();