import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css'
import './index.css';
import 'fontsource-source-sans-pro'
import {Login} from "./login";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";

const theme = createMuiTheme({
        typography: {
            fontFamily: [
                '"Source Sans Pro"',
                'sans-serif',
            ].join(','),
        },
    });

const App = () => (
    <MuiThemeProvider theme={theme}>
        <Login/>
    </MuiThemeProvider>
);

ReactDOM.render(<App/>, document.getElementById('root'));
