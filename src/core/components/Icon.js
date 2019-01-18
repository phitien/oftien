import React from "react";
import classnames from "classnames";
import * as icons from "@material-ui/icons";

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
    ) : icons[icon] ? (
      React.createElement(icons[icon], {
        title: title || description || "",
        className: classnames("svg-icon", className),
        onClick
      })
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
