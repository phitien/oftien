import "./main.scss";

import React from "react";
import { Helmet } from "react-helmet";
import uuidv4 from "uuid/v4";

import { Button, Icon, Page } from "../../../../core";

import { loadProfile, colors, layouts } from "./utils";

export default class Main extends Page {
  static isDefault = true;
  static path = "/";
  static layout = "Main_Right";
  static className = "route-home-main";

  state = {
    editing: false,
    username: this.username,
    settings: {}
  };
  get layout() {
    return super.layout || this.settings.layout;
  }
  get fontFamily() {
    return this.settings.fontFamily || super.fontFamily;
  }
  get fontWeight() {
    return this.settings.fontWeight || super.fontWeight;
  }
  get fontSize() {
    return this.settings.fontSize || super.fontSize;
  }
  get highlight() {
    return this.settings.highlight || super.highlight;
  }
  get color() {
    return this.settings.color || super.color;
  }
  get bgcolor() {
    return this.settings.bgcolor || super.bgcolor;
  }
  get layoutSettings() {
    const { layout, settings } = this;
    const alllayouts = { ...layouts, ...settings.layouts };
    return alllayouts[layout] || layouts.Main_Right;
  }
  get username() {
    return this.props.match.params.username || "oftien";
  }
  get settings() {
    return {
      avatarMargin: "0px 0px",
      ...layouts,
      ...this.state.settings
    };
  }

  async componentDidMount() {
    await super.componentDidMount();
    this.jPageDom.on("scroll", function(e) {
      const me = global.$(this);
      if (this.scrollTop > 0) me.addClass("scrolling");
      else me.removeClass("scrolling");
    });
    this.loadProfile();
    this.createEditor();
  }
  async loadProfile() {
    const { username } = this;
    await loadProfile(username);
    this.setState({
      ...JSON.parse(JSON.stringify(this.props.Resume.detail)),
      username
    });
  }
  getSections(p) {
    const { state, layoutSettings } = this;
    const sections = layoutSettings[p] ? [].merge(layoutSettings[p]) : [];
    return sections.reduce((rs, k) => {
      if (state.hasOwnProperty(k)) rs[k] = state[k];
      return rs;
    }, {});
  }
  createEditor() {
    const { JSONEditor } = global;
    if (JSONEditor) {
      this.editor = new JSONEditor(this.editorDom, {
        onChange: () => this.setState(this.editor.get())
      });
      this.editorSettings = new JSONEditor(this.editorSettingsDom, {
        onChange: () => this.setState({ settings: this.editorSettings.get() })
      });
    }
  }
  onDataChange = () => {
    const data = Object.omit(
      this.state,
      "settings",
      "editing",
      "username",
      "className"
    );
    this.editor.set(data);
    this.editorSettings.set(this.settings);
  };
  onClone = e => {
    const onChangeUsername = e => {
      e.target.value = e.target.value.replace(/[\W_]/g, "-");
      this.setState({ username: e.target.value });
    };
    this.props.ApplicationAddPopup(
      <div className="fieldgroup" confirm={this.onSave}>
        <div className="inputfield">
          <div className="label">Username</div>
          <input
            type="text"
            placeholder="Username"
            defaultValue={this.username}
            onChange={onChangeUsername}
          />
        </div>
      </div>
    );
  };
  onSave = e => {
    const { api, apis } = global;
    const data = Object.omit(this.state, "editing", "username", "className");
    const { username } = this.state;
    return api(apis.Resume.save, { ...data, username: this.username }, [
      username
    ]).then(res => {
      if (!res.error && this.username !== username)
        this.props.history.replace(`/${username}`);
    });
  };

  renderSection(heading, children) {
    const props =
      typeof children === "string"
        ? { dangerouslySetInnerHTML: { __html: children } }
        : { children };
    return (
      <div
        key={heading}
        className={`section ${heading.replace(/[\W]/g, "_").lower()}`}
      >
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
      return <div key={uuidv4()} dangerouslySetInnerHTML={{ __html: o }} />;
    } else if (typeof o === "object") {
      const { name, items } = o;
      return items
        ? this.renderBlock(name, items, i)
        : this.renderObjectBlock(o, i);
    }
    return null;
  }
  renderInfo() {
    const { state, layoutSettings, settings } = this;
    const info = state.info || {};
    const infoFields = [].merge(layoutSettings.info);
    const { name, avatar } = info || {};
    return (
      <div key="info" className="section overview">
        <div
          className="avatar"
          style={{
            backgroundImage: `url(${avatar})`,
            backgroundPosition: settings.avatarMargin
          }}
        />
        <div className="info">
          <h2 className="name">{name}</h2>
          {infoFields.map(f =>
            info[f] ? (
              <div key={f} className={f}>
                {info[f]}
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  }
  renderLeftBanner() {
    const { settings } = this;
    let idx = 0;
    return (
      <div className="fixed left-banner no-printing">
        {`OfTien in Progress`
          .split(" ")
          .filter(o => o)
          .map((w, i) => (
            <div key={i} className="word">
              {w.split("").map((o, j) => {
                const color = colors[idx];
                idx++;
                return (
                  <div
                    key={j}
                    className="letter"
                    style={{ "--cl-highlight": color, color }}
                    onClick={async e => {
                      await global.localStorage.setItem("highlight", color);
                      settings.highlight = color;
                      this.setState({ settings }, async () => {
                        await this.onDataChange();
                        global
                          .jQuery("body")
                          .attr("style", `--cl-highlight: ${color}`);
                      });
                    }}
                  >
                    {o}
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    );
  }
  renderMain() {
    const { state, settings } = this;
    const { info } = state;
    const { name, avatar } = info || {};
    const { keywords, author, description } = info || {};
    const sections = this.getSections("main");
    return (
      <div className="wrraper">
        <Helmet>
          <title>{`${name}'s Profile`}</title>
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
          <meta name="description" content={description} />
          {settings.style ? <style>{settings.style}</style> : null}
        </Helmet>
        <div className="sections">
          {Object.keys(sections).map((k, j) =>
            this[`render${k.ucfirst()}`]
              ? this[`render${k.ucfirst()}`]()
              : this.renderSection(
                  k,
                  []
                    .merge(sections[k])
                    .map((o, i) => this.renderSectionBlock(o, i)),
                  j
                )
          )}
        </div>
        {this.renderButtons()}
        {this.renderLeftBanner()}
      </div>
    );
  }
  renderContact() {
    const { state, layoutSettings } = this;
    const contact = [].merge(state.contact);
    const search = [].merge(layoutSettings.contact);
    const fields = [];
    contact.map(o => (search.includes(o.type) ? fields.push(o) : false));
    if (!fields.length) return null;
    const getHref = o =>
      `${o.protocol}${o.value}${o.query ? `?${o.query}` : ""}`;
    const renderMobile = (o, i) => {
      return [
        <span key={i} className={o.type} data-name={o.type}>
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
          {o.viber ? <Icon icon="fab fa-viber" /> : null}
          {o.wechat ? <Icon icon="fab fa-weixin" /> : null}
        </span>
      ];
    };
    return (
      <div key="contact" className="section contact">
        {fields.map((o, i) =>
          o.type === "mobile" || o.type === "phone" ? (
            renderMobile(o, i)
          ) : !o.protocol && !o.query ? (
            <span key={i} className={o.type} data-name={o.type}>
              {o.value}
            </span>
          ) : (
            <a
              key={i}
              className={o.type}
              data-name={o.type}
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
      <div key="top" className="fixed top no-printing">
        <Button icon="fas fa-print" onClick={e => global.print()} />
        <Button icon="far fa-clone" onClick={this.onClone} />
        <Button icon="fas fa-save" onClick={this.onSave} />
        <Button
          icon={editing ? "far fa-times-circle" : "far fa-edit"}
          onClick={e => {
            const { editing } = this.state;
            this.setState(
              { editing: !editing, className: editing ? "" : "editing" },
              this.onDataChange
            );
          }}
        />
      </div>,
      <div key="layout-options" className="fixed layout-options no-printing">
        {this.renderLayoutOptions()}
      </div>,
      <div key="bottom" className="fixed bottom no-printing">
        <Button
          icon="fas fa-chevron-up"
          className="scroll-up"
          onClick={e => this.jPageDom.animate({ scrollTop: 0 }, 500)}
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
        <div className="sections">
          {Object.keys(sections).map((k, j) =>
            this[`render${k.ucfirst()}`]
              ? this[`render${k.ucfirst()}`]()
              : this.renderSection(
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
  renderLayoutOption(name) {
    const { settings } = this;
    const hash = global.location.hash;
    const parts = hash.split("&").filter(o => !/layout=.*/g.test(o));
    const active = name === this.layout;
    return (
      <div
        key={name}
        title={name}
        className={`layout-option ${name} ${active ? "active" : ""}`}
        onClick={async e => {
          await global.localStorage.setItem("layout", name);
          settings.layout = name;
          this.setState({ settings }, async () => {
            await this.onDataChange();
            global.location.hash = [...parts, `layout=${name}`].join("&");
          });
        }}
      />
    );
  }
  renderLayoutOptions() {
    return [
      this.renderLayoutOption("Left_Main"),
      this.renderLayoutOption("Left_Main_Right"),
      this.renderLayoutOption("Main_Right"),
      this.renderLayoutOption("Main")
    ];
  }
  renderExtra() {
    const { editing } = this.state;
    return (
      <div
        key="editor"
        className="editor no-printing"
        style={{ display: editing ? "flex" : "none" }}
      >
        <div
          className="jsoneditor-container jsoneditor-container-settings"
          ref={e => (this.editorSettingsDom = e)}
        />
        <div className="jsoneditor-container" ref={e => (this.editorDom = e)} />
      </div>
    );
  }
}
