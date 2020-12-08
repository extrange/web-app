import {createMuiTheme} from "@material-ui/core/styles";

export const theme = createMuiTheme({
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

export const OverlayScrollbarOptions = {
    className: 'os-theme-light',
    overflowBehavior: {
        x: 'hidden'
    },
    scrollbars: {
        autoHide: 'move',
    }
};