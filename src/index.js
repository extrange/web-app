import ReactDOM from 'react-dom';
import {StrictMode} from "react";
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/source-sans-pro' //For codemirror in markdownEditor.js
import './components/starcraft.css' //Stylized font for menu
import {MuiThemeProvider} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import {LoginCheck} from "./login/loginCheck";
import {LoadServiceWorker} from "./loadServiceWorker";
import {ErrorBoundary} from "./components/errorBoundary";
import 'overlayscrollbars/css/OverlayScrollbars.css'
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {OverlayScrollbarOptions, theme} from "./theme";
import {RandomBackground} from "./components/randomBackground";

/*Largest index of background images, inclusive*/
const numImages = 26;

ReactDOM.render(
    <StrictMode>
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <RandomBackground numImages={numImages}/>
            <ErrorBoundary>
                <LoadServiceWorker/>

                <OverlayScrollbarsComponent
                    options={OverlayScrollbarOptions}>
                    <LoginCheck/>
                </OverlayScrollbarsComponent>

            </ErrorBoundary>
        </MuiThemeProvider>
    </StrictMode>
    , document.getElementById('root'));



