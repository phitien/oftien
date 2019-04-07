import "./{{ page }}.scss";

import React from "react";

import { Page } from "../../components";

import { connect } from "../../redux";

class {{ Page }} extends Page {
  state = { loading: false };
  async componentDidMount() {
    await super.componentDidMount();
  }
  renderComponent() {
    return (
      <div className="page page-{{ pname }} page-{{ pname }}-{{ page }}">
        <h3>{{ heading }}</h3>
        <div className="page-content">
          <div className="wrapper">Hello! This is a generated page</div>
        </div>
      </div>
    );
  }
}

export default connect({{ Page }});
