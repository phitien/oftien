import React from "react";
import classnames from "classnames";

import Component from "./Component";

export class Icon extends Component {
  renderComponent() {
    const { icon, title, description, className, onClick } = this.props;
    const isImage = /.+\.\w{1,5}$/g.test(icon);
    return isImage ? (
      <img
        className={classnames("image-icon", className)}
        src={icon}
        alt={title || description || ""}
        onClick={onClick}
      />
    ) : (
      <i
        className={classnames("font-icon", icon, className)}
        title={title || description || ""}
        onClick={onClick}
      />
    );
  }
}
export default Icon;
