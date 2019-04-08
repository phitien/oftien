import "./derivatives.scss";

import React from "react";
import uuidv4 from "uuid/v4";

import Main, { loadProfile } from "./Main";

export default class Derivatives extends Main {
  static isDefault = false;
  static path = "/:username";
  static layout = "Main_Right";
  static className = "route-home-derivatives";
}
