import React from "react";
import classnames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";

import Component from "./Component";

export class Spinner extends Component {
  renderComponent() {
    const { size, overlay, className } = this.props;
    const render = () => (
      <CircularProgress
        size={size || overlay === false ? 24 : 40}
        className={classnames("spinner", overlay === false ? className : "")}
      />
    );
    if (overlay === false) return render();
    return <div className={classnames("overlay", className)}>{render()}</div>;
  }
}
export default Spinner;
