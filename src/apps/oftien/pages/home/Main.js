import "./home.scss";

import React from "react";
import uuidv4 from "uuid/v4";

import { Button, Logo, Page } from "../../../../core";

import experiences from "./experiences";
import info from "./info";
import projects from "./projects";
import skills from "./skills";

export default class Home extends Page {
  static isDefault = true;
  static path = "/";
  static layout = "Main_Right";
  static className = "route-home";

  renderSection(heading, children) {
    const props =
      typeof children === "string"
        ? { dangerouslySetInnerHTML: { __html: children } }
        : { children };
    return (
      <div className="section">
        <h3 className="heading">{heading}</h3>
        <div {...props} />
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
  renderProject(o, i) {
    const { name, role, company, used, description } = o;
    return this.renderBlock(
      name,
      `${role} at ${company}.<br/> Used: ${used}<br/>${description}`,
      i
    );
  }
  renderSkill(o, i) {
    const { name, items } = o;
    return this.renderBlock(name, items, i);
  }
  renderMain() {
    const { name, occupation, quote, intro } = info;
    return (
      <div className="wrraper">
        <div className="horizontal middle">
          <div className="avatar" />
          <div className="info">
            <h2 className="name">{name}</h2>
            <div className="occupation">{occupation}</div>
            <div className="quote">{quote}</div>
            <div className="intro">{intro}</div>
          </div>
        </div>
        {}
        {this.renderSection(
          "Experience",
          experiences.map((o, i) => this.renderExperience(o, i))
        )}
        {this.renderSection(
          "Projects",
          projects.map((o, i) => this.renderProject(o, i))
        )}
      </div>
    );
  }
  renderRight() {
    const { contact } = info;
    return (
      <div className="wrraper">
        {contact}
        {this.renderSection(
          "Skills",
          skills.map((o, i) => this.renderSkill(o, i))
        )}
        {this.renderSection(
          "Education",
          "Hanoi Water Resources University (2002 - 2007).<br/>Bachelor of Computer Science.<br/>Information Technology"
        )}
      </div>
    );
  }
}
