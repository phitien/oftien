import "./home.scss";

import React from "react";
import uuidv4 from "uuid/v4";

import { Button, Logo, Page } from "../../../../core";

import experiences from "./experiences";
import skills from "./skills";

export default class Home extends Page {
  static isDefault = true;
  static path = "/";
  static layout = "Main_Right";
  static className = "route-home";

  renderSection(heading, children) {
    return (
      <div className="section">
        <h3 className="heading">{heading}</h3>
        {children || null}
      </div>
    );
  }
  renderBlock(heading, children, i) {
    const props =
      typeof children === "string"
        ? { dangerouslySetInnerHTML: { __html: children } }
        : { children };
    return (
      <div key={i || uuidv4()} className="block">
        <h4 className="heading">{heading}</h4>
        <div {...props} />
      </div>
    );
  }
  renderPeriod(start, end) {
    return (
      <span className="period">
        <span className="start">{start}</span>
        {" - "}
        <span className="end">{end}</span>
      </span>
    );
  }
  renderExperience(o, i) {
    const { name, role, period, description } = o;
    const { start, end } = period;
    return this.renderBlock(
      [
        <span className="name">{name}</span>,
        <span className="role">{role}</span>,
        this.renderPeriod(start, end)
      ],
      description,
      i
    );
  }
  renderSkill(o, i) {
    const { name, items } = o;
    return this.renderBlock(name, items, i);
  }
  renderMain() {
    return (
      <div className="wrraper">
        <div className="horizontal middle">
          <div className="avatar" />
          <div className="info">
            <h2 className="name">Phi Tien</h2>
            <div className="occupation">Senior UI Developer (Web & Mobile)</div>
          </div>
        </div>
        {}
        {this.renderSection(
          "Experience",
          experiences.map((o, i) => this.renderExperience(o, i))
        )}
        {this.renderSection("Projects", [])}
      </div>
    );
  }
  renderRight() {
    return (
      <div className="wrraper">
        <div className="info">
          <a className="website" target="_blank" href="http://info.oftien.com">
            http://info.oftien.com
          </a>
          <a
            className="github"
            target="_blank"
            href="https://github.com/phitien"
          >
            https://github.com/phitien
          </a>
          <a
            className="email"
            target="_blank"
            href="mailto://im.phitien@gmail.com"
          >
            im.phitien@gmail.com
          </a>
          <a className="skype" target="_blank" href="skype://im.phitien">
            skype: im.phitien
          </a>
          <div className="mobile">(+65)85986657, (+84)946847882</div>
          <div className="address">Vietnam, Singapore</div>
        </div>
        {this.renderSection(
          "Skills",
          skills.map((o, i) => this.renderSkill(o, i))
        )}
      </div>
    );
  }
}
