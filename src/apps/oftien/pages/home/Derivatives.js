import "./derivatives.scss";

import React from "react";
import uuidv4 from "uuid/v4";

import { Button, Icon, Logo, Page } from "../../../../core";

import Main, { loadProfile } from "./Main";

export default class Derivatives extends Main {
  static isDefault = false;
  static path = "/:username";
  static layout = "Main_Right";
  static className = "route-home-derivatives";

  loadProfile() {
    const { username } = this.props.match.params;
    loadProfile(username).then(res =>
      res.error ? false : this.setState({ ...res, username })
    );
  }
}
