import React from "react";

import Page from "./Page";

export class NotFound extends Page {
  static isDefault = true;
  static path = "/notfound";
  static layout = "Main";
  renderMain() {
    return <div className="center">Page not found</div>;
  }
}
export default NotFound;
