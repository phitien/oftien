import React, { Component, Fragment } from "react";
import { Provider } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Viewport from "./Viewport";

export default class Application extends Component {
  render() {
    const { store, routes, theme } = global;
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <Fragment>
            <CssBaseline />
            <Viewport routes={routes} />
          </Fragment>
        </MuiThemeProvider>
      </Provider>
    );
  }
}
