import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import classnames from "classnames";

import { connect } from "../redux";

import Component from "./Component";
import Popup from "./Popup";
import Notification from "./Notification";
import Spinner from "./Spinner";

export class Viewport extends Component {
  async componentDidMount() {
    const { api, apis } = global;
    await api(apis.Application.config);
    global.jQuery(global.document).keyup(e => {
      if (e.keyCode === 27) {
        e.preventDefault();
        this.props.ApplicationRemoveLastPopup();
      }
    });
  }
  renderRoutes() {
    return global.routes;
    // return <Switch>{global.routes}</Switch>;
  }
  renderMainContent() {
    return (
      <div className={classnames("main-content")}>{this.renderRoutes()}</div>
    );
  }
  renderPopups() {
    const { popups } = this.props.Application;
    if (!popups.length) return null;
    return popups.map((o, i) => (
      <Popup key={i} data={o}>
        {o.view || o}
      </Popup>
    ));
  }
  renderSpinner() {
    const { loading } = this.props.Application;
    if (!loading) return null;
    return <Spinner />;
  }
  renderNotifications() {
    const { notifications } = this.props.Application;
    if (!notifications.length) return null;
    return (
      <div className="notifications">
        {notifications.map((o, i) => (
          <Notification key={i} data={o} />
        ))}
      </div>
    );
  }
  renderComponent() {
    const { className } = this.props;
    return (
      <Router>
        <div className={classnames("viewport", className)}>
          {this.renderMainContent()}
          {this.renderPopups()}
          {this.renderSpinner()}
          {this.renderNotifications()}
        </div>
      </Router>
    );
  }
}
export default connect({ component: Viewport });
