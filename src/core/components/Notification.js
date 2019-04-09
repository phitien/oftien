import React from "react";
import classnames from "classnames";

import { connect } from "../redux";

import Component from "./Component";

export class Notification extends Component {
  componentDidMount() {
    setTimeout(
      e => this.props.ApplicationRemoveNotification(this.props.data),
      global.constants.notificationTimeout
    );
  }
  renderComponent() {
    const { data, className } = this.props;
    let type, message;
    if (typeof data === "string") {
      type = "message";
      message = data;
    } else {
      type = data.type || "message";
      message = data.message || data.text;
    }
    return (
      <div
        className={classnames("notification", type, className)}
        title="Click to dismiss"
        onClick={e => this.props.ApplicationRemoveNotification(data)}
      >
        {(message || "").toString()}
      </div>
    );
  }
}
export default connect({ component: Notification });
