import "./add-stock.scss";

import React from "react";

import { Button, Component, Icon, Logo, Space } from "../../../../core";

export default class AddStock extends Component {
  state = { value: "" };
  renderComponent() {
    return (
      <div className="add-stock">
        <input
          type="text"
          placeholder="Please enter stock(s), separated by ,"
          value={this.state.value}
          onChange={e => {
            const { target } = e;
            this.setState({ value: e.target.value }, () =>
              !this.props.onChange
                ? false
                : this.props.onChange({ target }, this.state.value)
            );
          }}
        />
      </div>
    );
  }
}
