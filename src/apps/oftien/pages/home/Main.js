import "./main.scss";

import React from "react";
import { Helmet } from "react-helmet";
import uuidv4 from "uuid/v4";

import { Button, Icon, Page } from "../../../../core";

export const loadProfile = async username => {
  username = !username || username === ":username" ? "oftien" : username;
  const { api } = global;
  return api({
    url: `/apps/oftien/profiles/${username}.json`
  });
};

export default class Main extends Page {
  static isDefault = true;
  static path = "/";
  static layout = "Main_Right";
  static className = "route-home-main";

  state = {
    username: this.props.match.params.username || "oftien",
    info: {},
    avatar: "",
    experiences: [],
    projects: [],
    skills: [],
    contact: []
  };

  get layoutDom() {
    return global.$(`.page.page-home-${this.constructor.name.lower()} .layout`);
  }
  get username() {
    return this.state.username;
  }

  async componentDidMount() {
    await super.componentDidMount();
    this.layoutDom.on("scroll", function(e) {
      const me = global.$(this);
      if (this.scrollTop > 0) me.addClass("scrolling");
      else me.removeClass("scrolling");
    });
    this.loadProfile();
  }
  updateMetadata = () => {
    const { info } = this.state;
    // document.title = `${info.name}'s profile'`;
  };
  loadProfile() {
    const { username } = this;
    loadProfile(username).then(res =>
      res.error
        ? false
        : this.setState({ ...res, username }, this.updateMetadata)
    );
  }

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
      <span key="period" className="period">
        <span className="start">{start}</span>
        {" - "}
        <span className="end">{end}</span>
      </span>
    );
  }
  renderExperience(o, i) {
    const { name, role, location, period, description } = o;
    const { start, end } = period;
    return this.renderBlock(
      [
        <span key="name" className="name">
          {name}
        </span>,
        <span key="role" className="role">
          {role}
        </span>,
        <span key="location" className="location">
          {location}
        </span>,
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
    const { info, experiences, projects, avatar, avatarMargin } = this.state;
    const { name, occupation, quote, intro } = info;
    const { keywords, author, description } = info;
    return (
      <div className="wrraper">
        <Helmet>
          <title>{`${name}'s Profile'`}</title>
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
          <meta name="description" content={description} />
        </Helmet>
        <div className="overview">
          <div
            className="avatar"
            style={{
              backgroundImage: `url(${avatar})`,
              backgroundPosition: avatarMargin || "0 0"
            }}
          />
          <div className="info">
            <h2 className="name">{name}</h2>
            <div className="occupation">{occupation}</div>
            <div className="quote">{quote}</div>
            <div className="intro">{intro}</div>
          </div>
        </div>
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
  renderContact() {
    const { contact } = this.state;
    const getHref = o =>
      `${o.protocol}${o.value}${o.query ? `?${o.query}` : ""}`;
    const renderMobile = (o, i) => {
      return [
        <span key={i} className="mobile">
          <a className="tel" href={`tel:${o.value.replace(/[\W]/g, "")}`}>
            {o.value}
          </a>
          <a
            className="sms"
            href={`sms:${o.value.replace(/[\W]/g, "")};?&body=[OfTien] Hi`}
          >
            <Icon icon="fas fa-comment-dots" />
          </a>
          {o.whatsapp ? (
            <a
              target="_blank"
              className="whatsapp"
              href={`https://wa.me/${o.value.replace(/[\W]/g, "")}${
                o.whatsapp_query
              }`}
            >
              <Icon icon="fab fa-whatsapp" />
            </a>
          ) : null}
        </span>
      ];
    };
    return (
      <div className="contact">
        {contact.map((o, i) =>
          o.type === "mobile" ? (
            renderMobile(o, i)
          ) : !o.protocol && !o.query ? (
            <span key={i} className={o.type}>
              {o.value}
            </span>
          ) : (
            <a
              key={i}
              className={o.type}
              target={o.external ? "_blank" : ""}
              href={getHref(o)}
            >
              {o.value}
              {o.type === "skype" ? <Icon icon="fab fa-skype" /> : null}
            </a>
          )
        )}
      </div>
    );
  }
  renderButtons() {
    return (
      <div className="fixed">
        <Button
          icon="fas fa-chevron-up"
          className="scroll-up"
          onClick={e => this.layoutDom.animate({ scrollTop: 0 }, 500)}
        />
        <Button icon="fas fa-print" onClick={e => global.print()} />
      </div>
    );
  }
  renderLeft = this.renderRight;
  renderRight() {
    const { skills } = this.state;
    return (
      <div className="wrraper">
        {this.renderButtons()}
        {this.renderContact()}
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
