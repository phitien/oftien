import React from "react";
import { Checkbox, Paper } from "@material-ui/core";

import { Button, Icon } from "../../../core";
import Products from "./Products";

export default class Successful extends Products {
  static path = "/success";
  static layout = "Main";

  renderMain() {
    return <iframe src="/successful" />;
  }
}
