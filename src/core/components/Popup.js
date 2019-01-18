import React from "react";
import classnames from "classnames";

import { connect } from "../redux";

import Button from "./Button";
import Component from "./Component";

export class Popup extends Component {
  async componentDidUpdate(prevProps) {}

  getProp = name => {
    const { data } = this.props;
    let p = data[name];
    if (!p && data.props) p = data.props[name];
    if (!p && data.length) p = data[0].props[name];
    return p;
  };

  onClose = async (e, ...args) => {
    //TODO
  };

  renderHeader(confirm) {
    const title = this.getProp("title");
    const noclose = this.getProp("noclose");
    return (
      <div className="header">
        {title ? <div className="title">{title}</div> : null}
        {confirm ? (
          <Button
            icon="Check"
            title="Confirm"
            className="confirm"
            onClick={async (...args) => {
              await this.onClose(...args);
              await confirm(...args);
            }}
          />
        ) : null}
        {!confirm && noclose ? null : (
          <Button
            icon="HighlightOff"
            title="Close"
            className="close"
            onClick={this.onClose}
          />
        )}
      </div>
    );
  }
  renderComponent() {
    const { children } = this.props;
    const confirm = this.getProp("confirm");
    const className = this.getProp("className");
    return (
      <div
        className={classnames("overlay", confirm ? "confirm" : "", className)}
      >
        <div className="wrapper">
          {this.renderHeader(confirm)}
          <div className="content">{children}</div>
        </div>
      </div>
    );
  }
}
export default connect({ component: Popup });
