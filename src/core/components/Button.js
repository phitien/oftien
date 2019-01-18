import React from "react";
import classnames from "classnames";
import { Tooltip, IconButton, Button as MButton } from "@material-ui/core";

import Component from "./Component";
import Icon from "./Icon";

export class Button extends Component {
  renderComponent() {
    const { rounded } = this.props;
    if (rounded) {
      const { disabled, icon, size, label, title, className } = this.props;
      const { onClick } = this.props;
      return disabled ? (
        <div className={classnames("btn-icon", className)}>
          <IconButton aria-label={label || title || ""} disabled={true}>
            <Icon icon={icon} size={size} />
          </IconButton>
        </div>
      ) : (
        <Tooltip
          title={title || label || ""}
          className={classnames("btn-icon", className)}
        >
          <IconButton aria-label={label || title || ""} disabled={true}>
            <Icon icon={icon} size={size} onClick={onClick} />
          </IconButton>
        </Tooltip>
      );
    }
    const { icon, size, name, label, text, title, children } = this.props;
    const { className, variant, disabled, circle, small, big } = this.props;
    const { transparent, nopadding, freecolor, onClick } = this.props;
    const btnName = name || label || text || "";
    const props = {
      ...Object.omit(
        this.props,
        ...[].concat(
          ["icon", "size", "name", "label", "text", "title", "children"],
          ["className", "variant", "disabled", "circle", "small", "big"],
          ["transparent", "nopadding", "freecolor", "onClick"]
        )
      ),
      title: title,
      disabled: disabled,
      variant: variant || "outlined",
      onClick: onClick,
      className: classnames(
        "btn",
        circle ? "circle" : "",
        small ? "small" : "",
        big ? "big" : "",
        transparent ? "transparent" : "",
        nopadding ? "nopadding" : "",
        freecolor ? "freecolor" : "",
        btnName ? "" : "no-name",
        className
      )
    };
    return (
      <MButton {...props}>
        {[].merge(
          icon ? <Icon key="icon" icon={icon} size={size} /> : null,
          btnName ? (
            <span key="name" className="text">
              {btnName}
            </span>
          ) : null,
          children
        )}
      </MButton>
    );
  }
}
export default Button;
