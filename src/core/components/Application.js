import React, { Component, Fragment } from "react";
import { Provider } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Helmet } from "react-helmet";
import Viewport from "./Viewport";

export default class Application extends Component {
  renderHead() {
    let trackingId = null;
    try {
      trackingId = require(`../../gg-analytics/${
        this.props.location.hostname
      }.js`).default;
    } catch (e) {}
    return !trackingId ? null : (
      <Helmet>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        />
        <script>{`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);};gtag('js', new Date());gtag('config', '${trackingId}');`}</script>
      </Helmet>
    );
  }
  render() {
    const { store, routes, theme } = global;
    return (
      <Provider store={store}>
        {this.renderHead()}
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
