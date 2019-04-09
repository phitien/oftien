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
    editing: false,
    username: this.props.match.params.username || "oftien",
    layout: {
      main: ["experiences", "projects"],
      left: ["skills", "education"],
      right: ["skills", "education"]
    }
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
    this.createEditor();
  }
  loadProfile() {
    const { username } = this;
    loadProfile(username).then(res =>
      res.error ? false : this.setState({ ...res, username })
    );
  }
  getSections(p) {
    const sections =
      this.state.layout && this.state.layout[p]
        ? [].merge(this.state.layout[p])
        : [];
    const state = this.state;
    return sections.reduce((rs, k) => {
      if (state.hasOwnProperty(k)) rs[k] = state[k];
      return rs;
    }, {});
  }
  createEditor() {
    const { JSONEditor } = global;
    if (JSONEditor)
      this.editor = new JSONEditor(this.editorDom, {
        onChange: () => this.setState(this.editor.get())
      });
  }
  onShowHideEditor = () => {
    const data = Object.omit(this.state, "editing", "username", "className");
    this.editor.set(data);
  };

  renderSection(heading, children) {
    const props =
      typeof children === "string"
        ? { dangerouslySetInnerHTML: { __html: children } }
        : { children };
    return (
      <div className={`section ${heading.replace(/[\W]/g, "_").lower()}`}>
        <h3 className="heading">{heading.ucfirst()}</h3>
        <div className="blocks" {...props} />
      </div>
    );
  }
  renderBlock(heading, children, i) {
    const props =
      typeof children === "string"
        ? { dangerouslySetInnerHTML: { __html: children } }
        : { children };
    return (
      <div
        key={i || uuidv4()}
        className={`block ${heading.replace(/[\W]/g, "_").lower()}`}
      >
        <h4 className="heading">{heading.ucfirst()}</h4>
        <div {...props} />
      </div>
    );
  }
  renderObject(k, o) {
    if (!o) return null;
    const keys = Object.keys(o);
    return (
      <span key={k} className={k}>
        {keys.map(n => (
          <span key={n} className={n}>
            {o[n]}
          </span>
        ))}
      </span>
    );
  }
  renderObjectBlock(o, i) {
    const { name } = o;
    const keys = Object.keys(o);
    Object.omit(keys, "name");
    return this.renderBlock(
      name,
      [
        ...keys.map(k =>
          typeof o[k] === "object" ? (
            this.renderObject(k, o[k])
          ) : (
            <span key={k} className={k}>
              {o[k]}
            </span>
          )
        )
      ],
      i
    );
  }
  renderSectionBlock(o, i) {
    if (!o) return null;
    if (typeof o === "string") {
      return <div dangerouslySetInnerHTML={{ __html: o }} />;
    } else if (typeof o === "object") {
      const { name, items } = o;
      return items
        ? this.renderBlock(name, items, i)
        : this.renderObjectBlock(o, i);
    }
    return null;
  }
  renderMain() {
    const { state } = this;
    const { info, avatar, avatarMargin } = state;
    const { name, occupation, quote, intro, funny } = info || {};
    const { keywords, author, description } = info || {};
    const sections = this.getSections("main");
    return (
      <div className="wrraper">
        <Helmet>
          <title>{`${name}'s Profile`}</title>
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
            <div className="intro">
              {intro}
              <span className="funny">{funny}</span>
            </div>
          </div>
        </div>
        <div className="sections">
          {Object.keys(sections).map((k, j) =>
            this.renderSection(
              k,
              []
                .merge(sections[k])
                .map((o, i) => this.renderSectionBlock(o, i)),
              j
            )
          )}
        </div>
      </div>
    );
  }
  renderContact() {
    const { contact } = this.state;
    if (!contact) return null;
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
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
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
    const { editing } = this.state;
    return [
      <div key="top" className="fixed top">
        <Button icon="fas fa-print" onClick={e => global.print()} />
        <Button
          icon={editing ? "fas fa-save" : "far fa-edit"}
          onClick={e => {
            const { editing } = this.state;
            this.setState(
              { editing: !editing, className: editing ? "" : "editing" },
              this.onShowHideEditor
            );
          }}
        />
      </div>,
      <div key="bottom" className="fixed bottom">
        <Button
          icon="fas fa-chevron-up"
          className="scroll-up"
          onClick={e => this.layoutDom.animate({ scrollTop: 0 }, 500)}
        />
      </div>
    ];
  }
  renderRight() {
    return this.renderSide(this.getSections("right"));
  }
  renderLeft() {
    return this.renderSide(this.getSections("left"));
  }
  renderSide(sections) {
    return (
      <div className="wrraper">
        {this.renderButtons()}
        {this.renderContact()}
        <div className="sections">
          {Object.keys(sections).map((k, j) =>
            this.renderSection(
              k,
              []
                .merge(sections[k])
                .map((o, i) => this.renderSectionBlock(o, i)),
              j
            )
          )}
        </div>
      </div>
    );
  }
  renderExtra() {
    const { editing } = this.state;
    return (
      <div
        key="editor"
        className="editor"
        ref={e => (this.editorDom = e)}
        style={{ display: editing ? "block" : "none" }}
      />
    );
  }
}
