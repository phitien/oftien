import React from "react";
import { Button, Logo, Page } from "../../../core";

export default class Home extends Page {
  static isDefault = true;
  static path = "/";
  static layout = "Main";

  onLogin() {
    this.props.history.push(global.constants.defaultPath);
  }
  renderMain() {
    return (
      <div className="login">
        <Logo />
        <form className="login-form" autocomplete={false}>
          <h4>Login</h4>
          <div className="inputfield">
            <label>Email</label>
            <input
              className="input"
              type="text"
              autocomplete={false}
              spellcheck={false}
              placeholder="Email"
            />
          </div>
          <div className="inputfield">
            <label>Password</label>
            <input
              className="input"
              type="password"
              autocomplete={false}
              spellcheck={false}
              placeholder="Password"
            />
          </div>
          <Button
            big
            fullWidth
            color="secondary"
            label="Login"
            onClick={e => this.onLogin()}
          />
          <div className="no-account">Do not have any account?</div>
          <a className="request-access">Request access</a>
        </form>
      </div>
    );
  }
}
