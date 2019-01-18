import React from "react";
import classnames from "classnames";

import Component from "./Component";

export class Space extends Component {
  renderComponent() {
    const { style, className } = this.props;
    return <div className={classnames("space", className)} style={style} />;
  }
}
export default Space;
