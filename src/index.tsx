import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/source-sans-pro"; //For codemirror in MarkdownEditor.js
import { MuiThemeProvider } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import "overlayscrollbars/css/OverlayScrollbars.css";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./app/App";
import { ErrorBoundary } from "./app/error-boundary/ErrorBoundary";
import { LoadServiceWorker } from "./app/load-service-worker/LoadServiceWorker";
import { BackendSnackbar } from "./app/network-core/BackendSnackbar";
import { NetworkErrorAlert } from "./app/network-error/NetworkErrorAlert";
import { store } from "./app/store";
import { theme } from "./app/theme";
import { RandomBackground } from "./shared/components/randomBackground";
import "./shared/static/fonts/starcraft/starcraft.css"; //Stylized font for menu

const USE_MOCK_SERVICE_WORKER = false;

/*Run mock SW if in development mode*/
const prepare =
  process.env.NODE_ENV === "development" && USE_MOCK_SERVICE_WORKER
    ? import("./test/mocks/browser").then(({ worker }) => worker.start())
    : Promise.resolve();

prepare.then(() => {
  const container = document.getElementById("root");
  const root = createRoot(container!);
  root.render(
    <StrictMode>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <RandomBackground />
        <ErrorBoundary>
          <Provider store={store}>
            <LoadServiceWorker />
            <BackendSnackbar />
            <NetworkErrorAlert />
            <App />
          </Provider>
        </ErrorBoundary>
      </MuiThemeProvider>
    </StrictMode>
  );
});
