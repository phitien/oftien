import "./derivatives.scss";

import Main from "./Main";

export default class Derivatives extends Main {
  static isDefault = false;
  static path = "/of/:username";
  static layout = "Main_Right";
  static className = `${Main.className} route-home-derivatives`;
}
