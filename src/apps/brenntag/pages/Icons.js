import React from "react";

import * as icons from "@material-ui/icons";
import { Page } from "../../../core";

export default class Icons extends Page {
  static path = "/icons";
  static layout = "Main";
  renderIcon(k, i) {
    const cmp = icons[k];
    return (
      <div
        className="icon"
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "grey",
          borderRadius: "50%",
          width: 80,
          height: 80,
          margin: "6px"
        }}
      >
        {React.createElement(cmp)}
        <div
          style={{
            marginTop: 4,
            width: 70,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {k}
        </div>
      </div>
    );
  }
  renderMain() {
    return (
      <div className="icons">
        {Object.keys(icons).map((k, i) => this.renderIcon(k, i))}
      </div>
    );
  }
}
