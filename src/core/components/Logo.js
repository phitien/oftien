import React from "react";
import classnames from "classnames";

import Component from "./Component";

export class Logo extends Component {
  renderComponent() {
    const { logo, className, onClick } = this.props;
    return (
      <div
        onClick={onClick}
        className={classnames("logo", className)}
        style={{
          backgroundImage: `url(${logo ||
            global.constants.logo ||
            "/logo.svg"})`
        }}
      />
    );
  }
}
export default Logo;
