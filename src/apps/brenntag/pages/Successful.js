import React from "react";

import { Page } from "../../../core";

export default class Successful extends Page {
  static path = "/successful/:poReference/:orderReference";
  static layout = "Main";

  renderMain() {
    const { poReference, orderReference } = this.props.match.params;
    return (
      <iframe
        src={`/successful.html?poReference=${poReference}&orderReference=${orderReference}`}
      />
    );
  }
}
