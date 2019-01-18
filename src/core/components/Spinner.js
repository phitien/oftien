import React from "react";
import classnames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";

import Component from "./Component";

export class Spinner extends Component {
  renderComponent() {
    const { size, overlay, inside, className } = this.props;
    const render = () => (
      <CircularProgress
        size={size || inside ? 24 : 40}
        className={classnames("spinner", overlay !== false ? "" : className)}
      />
    );
    if (overlay !== false)
      return (
        <div
          className={classnames("overlay", inside ? "inside" : "", className)}
        >
          {render()}
        </div>
      );
    return render();
  }
}
export default Spinner;
