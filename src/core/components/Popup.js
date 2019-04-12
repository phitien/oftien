import React from "react";
import classnames from "classnames";

import { connect } from "../redux";

import Button from "./Button";
import Component from "./Component";

export class Popup extends Component {
  state = { maximize: false };

  async componentDidUpdate(prevProps) {}

  getProp = name => {
    const { data } = this.props;
    if (!data) return null;
    let p = data[name];
    if (!p && data.props) p = data.props[name];
    if (!p && data.length && data[0].props) p = data[0].props[name];
    return p;
  };

  canClose = async () =>
    this.props.canClose ? await this.props.canClose() : true;
  onClose = async (e, ...args) => {
    if (await this.canClose()) {
      if (this.props.beforeClose) this.props.beforeClose(this);
      await this.props.ApplicationRemoveLastPopup();
    }
  };

  renderHeader(confirm) {
    const { maximize } = this.state;
    const title = this.getProp("title");
    const noclose = this.getProp("noclose");
    return (
      <div className="header">
        {title ? <div className="title">{title}</div> : null}
        <div className="actions">
          {confirm ? (
            <Button
              icon="fas fa-save"
              title="Confirm"
              className="confirm"
              onClick={async (...args) => {
                if ((await confirm(...args, this)) !== false)
                  await this.onClose(...args);
              }}
            />
          ) : null}
          <Button
            icon={maximize ? "fas fa-compress" : "fas fa-arrows-alt"}
            onClick={e => this.setState({ maximize: !maximize })}
          />
          {noclose ? null : (
            <Button
              icon="far fa-times-circle"
              title="Close"
              className="close"
              onClick={this.onClose}
            />
          )}
        </div>
      </div>
    );
  }
  renderComponent() {
    const { maximize } = this.state;
    const { children } = this.props;
    const confirm = this.getProp("confirm");
    const className = this.getProp("className");
    return (
      <div
        className={classnames(
          "overlay popup",
          confirm ? "confirm" : "",
          maximize ? "maximize" : "",
          className
        )}
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
