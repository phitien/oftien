import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

export default class Component extends React.Component {
  renderComponent() {
    throw new Error("Function renderComponent is not implemented");
  }
  render() {
    const { theme } = this.props;
    if (theme)
      return (
        <MuiThemeProvider theme={createMuiTheme(theme)}>
          {this.renderComponent()}
        </MuiThemeProvider>
      );
    return this.renderComponent();
  }
}
